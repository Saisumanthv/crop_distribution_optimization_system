import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CropData {
  state_name: string;
  crop: string;
  production: number;
  area: number;
  yield: number;
}

interface TradeRecommendation {
  crop: string;
  partner_state: string;
  distance_km: number;
  quantity: number;
  reason: string;
  environmental_benefit: string;
  cost_benefit: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const stateName = url.searchParams.get("state_name");
    const cropYear = url.searchParams.get("crop_year");

    if (!stateName || !cropYear) {
      return new Response(
        JSON.stringify({ error: "state_name and crop_year are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get production data for the selected state and year
    const { data: stateData, error: stateError } = await supabase
      .from("crop_production_data")
      .select("*")
      .eq("state_name", stateName)
      .eq("crop_year", cropYear);

    if (stateError) throw stateError;

    if (!stateData || stateData.length === 0) {
      return new Response(
        JSON.stringify({
          error: `No production data found for ${stateName} in ${cropYear}`,
          sell_recommendations: [],
          buy_recommendations: []
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get all states production data for the same year
    const { data: allStatesData, error: allStatesError } = await supabase
      .from("crop_production_data")
      .select("*")
      .eq("crop_year", cropYear);

    if (allStatesError) throw allStatesError;

    // Calculate national average production per crop
    const cropAverages = new Map<string, number>();
    const cropStateTotals = new Map<string, Map<string, number>>();

    allStatesData?.forEach((record: any) => {
      const crop = record.crop;
      const state = record.state_name;
      const production = parseFloat(record.production) || 0;

      if (!cropStateTotals.has(crop)) {
        cropStateTotals.set(crop, new Map());
      }

      const currentTotal = cropStateTotals.get(crop)!.get(state) || 0;
      cropStateTotals.get(crop)!.set(state, currentTotal + production);
    });

    // Calculate averages
    cropStateTotals.forEach((stateTotals, crop) => {
      const values = Array.from(stateTotals.values());
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      cropAverages.set(crop, avg);
    });

    // Analyze selected state's production
    const stateProduction = new Map<string, number>();
    stateData.forEach((record: any) => {
      const crop = record.crop;
      const production = parseFloat(record.production) || 0;
      const current = stateProduction.get(crop) || 0;
      stateProduction.set(crop, current + production);
    });

    // Get interstate distances (bidirectional)
    const { data: distances, error: distancesError } = await supabase
      .from("interstate_distances")
      .select("*")
      .or(`state_from.eq.${stateName},state_to.eq.${stateName}`);

    if (distancesError) throw distancesError;

    const distanceCache = new Map<string, number>();

    // Helper function to get distance between two states (checks both directions)
    const getDistance = async (state1: string, state2: string): Promise<number> => {
      const cacheKey = [state1, state2].sort().join("-");

      if (distanceCache.has(cacheKey)) {
        return distanceCache.get(cacheKey)!;
      }

      const distance = distances?.find((d: any) =>
        (d.state_from === state1 && d.state_to === state2) ||
        (d.state_from === state2 && d.state_to === state1)
      );

      if (distance) {
        const distKm = parseFloat(distance.distance_km);
        distanceCache.set(cacheKey, distKm);
        return distKm;
      }

      try {
        const googleMapsApiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
        if (!googleMapsApiKey) {
          distanceCache.set(cacheKey, 9999);
          return 9999;
        }

        const calcUrl = new URL(`${supabaseUrl}/functions/v1/calculate-distance`);
        calcUrl.searchParams.append("origin", state1);
        calcUrl.searchParams.append("destination", state2);

        const calcResponse = await fetch(calcUrl.toString());
        const calcData = await calcResponse.json();

        if (calcData.distance_km) {
          distanceCache.set(cacheKey, calcData.distance_km);
          return calcData.distance_km;
        }
      } catch (error) {
        console.error(`Error calculating distance between ${state1} and ${state2}:`, error);
      }

      distanceCache.set(cacheKey, 9999);
      return 9999;
    };

    // SELL RECOMMENDATIONS: Find crops where state has surplus
    const sellRecommendations: TradeRecommendation[] = [];

    for (const [crop, production] of stateProduction.entries()) {
      const avgProduction = cropAverages.get(crop) || 0;

      // If state produces 20% more than average, consider it surplus
      if (production > avgProduction * 1.2) {
        const surplus = production - avgProduction;

        // Find states that need this crop (produce less than average)
        const needyStates: Array<{state: string, deficit: number, distance: number}> = [];
        const cropStateMap = cropStateTotals.get(crop);

        if (cropStateMap) {
          for (const [state, prod] of cropStateMap.entries()) {
            if (state !== stateName && prod < avgProduction * 0.8) {
              const distance = await getDistance(stateName, state);
              needyStates.push({
                state,
                deficit: avgProduction - prod,
                distance
              });
            }
          }
        }

        // Sort by distance (nearest first)
        needyStates.sort((a, b) => a.distance - b.distance);

        // Recommend top 3 nearest states
        needyStates.slice(0, 3).forEach(({ state, distance }) => {
          const co2Saved = (distance < 500) ? "High" : (distance < 800) ? "Medium" : "Low";
          const costSaving = ((1000 - distance) / 10).toFixed(0);

          sellRecommendations.push({
            crop,
            partner_state: state,
            distance_km: distance,
            quantity: Math.round(surplus * 0.3), // Can sell up to 30% of surplus
            reason: `${stateName} produces ${production.toFixed(0)}T of ${crop}, which is ${((production/avgProduction - 1) * 100).toFixed(0)}% above national average. ${state} produces below average.`,
            environmental_benefit: `Reduces CO₂ emissions (${co2Saved} impact due to ${distance}km distance)`,
            cost_benefit: `Saves approximately ₹${costSaving} per tonne in transportation costs`
          });
        });
      }
    }

    // BUY RECOMMENDATIONS: Find crops where state has deficit
    const buyRecommendations: TradeRecommendation[] = [];

    for (const [crop, avgProduction] of cropAverages.entries()) {
      const stateProdn = stateProduction.get(crop) || 0;

      // If state produces 20% less than average, consider it deficit
      if (stateProdn < avgProduction * 0.8) {
        const deficit = avgProduction - stateProdn;

        // Find states that have surplus of this crop
        const surplusStates: Array<{state: string, surplus: number, distance: number}> = [];
        const cropStateMap = cropStateTotals.get(crop);

        if (cropStateMap) {
          for (const [state, prod] of cropStateMap.entries()) {
            if (state !== stateName && prod > avgProduction * 1.2) {
              const distance = await getDistance(stateName, state);
              surplusStates.push({
                state,
                surplus: prod - avgProduction,
                distance
              });
            }
          }
        }

        // Sort by distance (nearest first)
        surplusStates.sort((a, b) => a.distance - b.distance);

        // Recommend top 3 nearest states
        surplusStates.slice(0, 3).forEach(({ state, distance }) => {
          const co2Saved = (distance < 500) ? "High" : (distance < 800) ? "Medium" : "Low";
          const costSaving = ((1000 - distance) / 10).toFixed(0);

          buyRecommendations.push({
            crop,
            partner_state: state,
            distance_km: distance,
            quantity: Math.round(deficit * 0.5), // Can buy up to 50% of deficit
            reason: `${stateName} produces ${stateProdn.toFixed(0)}T of ${crop}, which is ${((1 - stateProdn/avgProduction) * 100).toFixed(0)}% below national average. ${state} has surplus production.`,
            environmental_benefit: `Reduces CO₂ emissions (${co2Saved} impact due to ${distance}km distance)`,
            cost_benefit: `Saves approximately ₹${costSaving} per tonne in transportation costs`
          });
        });
      }
    }

    return new Response(
      JSON.stringify({
        state_name: stateName,
        crop_year: cropYear,
        analysis_date: new Date().toISOString(),
        sell_recommendations: sellRecommendations.sort((a, b) => a.distance_km - b.distance_km),
        buy_recommendations: buyRecommendations.sort((a, b) => a.distance_km - b.distance_km),
        total_sell_opportunities: sellRecommendations.length,
        total_buy_opportunities: buyRecommendations.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-interstate-trade:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        sell_recommendations: [],
        buy_recommendations: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
