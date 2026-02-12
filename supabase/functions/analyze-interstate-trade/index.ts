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

    // Get interstate distances
    const { data: distances, error: distancesError } = await supabase
      .from("interstate_distances")
      .select("*")
      .eq("state_from", stateName);

    if (distancesError) throw distancesError;

    const stateDistances = new Map<string, number>();
    distances?.forEach((d: any) => {
      stateDistances.set(d.state_to, parseFloat(d.distance_km));
    });

    // SELL RECOMMENDATIONS: Find crops where state has surplus
    const sellRecommendations: TradeRecommendation[] = [];

    stateProduction.forEach((production, crop) => {
      const avgProduction = cropAverages.get(crop) || 0;

      // If state produces 20% more than average, consider it surplus
      if (production > avgProduction * 1.2) {
        const surplus = production - avgProduction;

        // Find states that need this crop (produce less than average)
        const needyStates: Array<{state: string, deficit: number, distance: number}> = [];

        cropStateTotals.get(crop)?.forEach((prod, state) => {
          if (state !== stateName && prod < avgProduction * 0.8) {
            const distance = stateDistances.get(state) || 9999;
            needyStates.push({
              state,
              deficit: avgProduction - prod,
              distance
            });
          }
        });

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
    });

    // BUY RECOMMENDATIONS: Find crops where state has deficit
    const buyRecommendations: TradeRecommendation[] = [];

    cropAverages.forEach((avgProduction, crop) => {
      const stateProdn = stateProduction.get(crop) || 0;

      // If state produces 20% less than average, consider it deficit
      if (stateProdn < avgProduction * 0.8) {
        const deficit = avgProduction - stateProdn;

        // Find states that have surplus of this crop
        const surplusStates: Array<{state: string, surplus: number, distance: number}> = [];

        cropStateTotals.get(crop)?.forEach((prod, state) => {
          if (state !== stateName && prod > avgProduction * 1.2) {
            const distance = stateDistances.get(state) || 9999;
            surplusStates.push({
              state,
              surplus: prod - avgProduction,
              distance
            });
          }
        });

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
    });

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
