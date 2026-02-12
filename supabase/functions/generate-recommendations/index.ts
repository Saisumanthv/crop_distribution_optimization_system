import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface StateProduction {
  state_name: string;
  crop: string;
  total_production: number;
  total_area: number;
}

interface StateDistance {
  from_state: string;
  to_state: string;
  distance_km: number;
  fuel_cost_per_km: number;
  co2_emission_per_km: number;
}

const stateDistances: Record<string, Record<string, number>> = {
  "Andhra Pradesh": { "Telangana": 150, "Karnataka": 450, "Tamil Nadu": 350, "Odisha": 800, "Maharashtra": 600, "Chhattisgarh": 900 },
  "Telangana": { "Andhra Pradesh": 150, "Karnataka": 400, "Maharashtra": 550, "Madhya Pradesh": 700, "Odisha": 900, "Chhattisgarh": 600 },
  "Odisha": { "West Bengal": 300, "Jharkhand": 250, "Chhattisgarh": 400, "Andhra Pradesh": 800, "Bihar": 450 },
  "Punjab": { "Haryana": 150, "Himachal Pradesh": 200, "Rajasthan": 350, "Uttarakhand": 450, "Delhi": 300, "Uttar Pradesh": 500 },
  "Haryana": { "Punjab": 150, "Rajasthan": 200, "Uttar Pradesh": 300, "Delhi": 100, "Uttarakhand": 400 },
  "Uttar Pradesh": { "Uttarakhand": 200, "Bihar": 300, "Madhya Pradesh": 400, "Haryana": 300, "Punjab": 500, "Rajasthan": 500, "Delhi": 400 },
  "Bihar": { "Jharkhand": 200, "West Bengal": 350, "Uttar Pradesh": 300, "Odisha": 450 },
  "West Bengal": { "Bihar": 350, "Jharkhand": 300, "Odisha": 300, "Assam": 600, "Sikkim": 550 },
  "Maharashtra": { "Karnataka": 500, "Goa": 350, "Gujarat": 500, "Madhya Pradesh": 400, "Telangana": 550, "Chhattisgarh": 700 },
  "Karnataka": { "Andhra Pradesh": 450, "Tamil Nadu": 300, "Kerala": 350, "Goa": 400, "Maharashtra": 500, "Telangana": 400 },
  "Tamil Nadu": { "Karnataka": 300, "Kerala": 250, "Andhra Pradesh": 350, "Puducherry": 150 },
  "Kerala": { "Tamil Nadu": 250, "Karnataka": 350 },
  "Gujarat": { "Rajasthan": 350, "Madhya Pradesh": 400, "Maharashtra": 500, "Dadra and Nagar Haveli and Daman and Diu": 200 },
  "Rajasthan": { "Punjab": 350, "Haryana": 200, "Uttar Pradesh": 500, "Madhya Pradesh": 400, "Gujarat": 350, "Delhi": 250 },
  "Madhya Pradesh": { "Uttar Pradesh": 400, "Rajasthan": 400, "Gujarat": 400, "Maharashtra": 400, "Chhattisgarh": 300, "Telangana": 700 },
  "Chhattisgarh": { "Madhya Pradesh": 300, "Maharashtra": 700, "Telangana": 600, "Odisha": 400, "Jharkhand": 400 },
  "Jharkhand": { "Bihar": 200, "West Bengal": 300, "Odisha": 250, "Chhattisgarh": 400, "Uttar Pradesh": 500 },
  "Assam": { "West Bengal": 600, "Meghalaya": 150, "Arunachal Pradesh": 300, "Nagaland": 250, "Manipur": 400, "Mizoram": 450, "Tripura": 350 },
  "Uttarakhand": { "Uttar Pradesh": 200, "Haryana": 400, "Himachal Pradesh": 300, "Delhi": 350 },
  "Himachal Pradesh": { "Punjab": 200, "Haryana": 300, "Uttarakhand": 300, "Jammu and Kashmir": 250 },
  "Goa": { "Maharashtra": 350, "Karnataka": 400 },
  "Delhi": { "Haryana": 100, "Uttar Pradesh": 400, "Rajasthan": 250, "Punjab": 300 },
};

function getDistance(state1: string, state2: string): number {
  if (state1 === state2) return 0;
  return stateDistances[state1]?.[state2] || stateDistances[state2]?.[state1] || 1500;
}

function predictProduction(historicalData: any[], targetYear: string): number {
  if (historicalData.length === 0) return 0;

  const sorted = historicalData.sort((a, b) => {
    const yearA = parseInt(a.crop_year.split("-")[0]);
    const yearB = parseInt(b.crop_year.split("-")[0]);
    return yearA - yearB;
  });

  if (sorted.length === 1) {
    return sorted[0].total_production * 1.02;
  }

  const years = sorted.map(d => parseInt(d.crop_year.split("-")[0]));
  const productions = sorted.map(d => d.total_production);

  const n = years.length;
  const sumX = years.reduce((a, b) => a + b, 0);
  const sumY = productions.reduce((a, b) => a + b, 0);
  const sumXY = years.reduce((sum, x, i) => sum + x * productions[i], 0);
  const sumX2 = years.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const targetYearNum = parseInt(targetYear.split("-")[0]);
  const prediction = slope * targetYearNum + intercept;

  return Math.max(0, prediction);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { searchParams } = new URL(req.url);
    const cropYear = searchParams.get("crop_year");
    const crop = searchParams.get("crop");

    if (!cropYear) {
      return new Response(
        JSON.stringify({ error: "crop_year parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetYearNum = parseInt(cropYear.split("-")[0]);
    const isPrediction = targetYearNum > 2015;

    let stateProductionData: StateProduction[] = [];

    if (isPrediction) {
      const { data: historicalData } = await supabase
        .from("crop_production_data")
        .select("state_name, crop, production, area, crop_year");

      if (historicalData) {
        const groupedData = historicalData.reduce((acc: any, record: any) => {
          const key = `${record.state_name}-${record.crop}`;
          if (!acc[key]) {
            acc[key] = {
              state_name: record.state_name,
              crop: record.crop,
              records: []
            };
          }
          acc[key].records.push(record);
          return acc;
        }, {});

        for (const key in groupedData) {
          const group = groupedData[key];
          const yearlyData = group.records.reduce((acc: any, record: any) => {
            if (!acc[record.crop_year]) {
              acc[record.crop_year] = { total_production: 0, total_area: 0, crop_year: record.crop_year };
            }
            acc[record.crop_year].total_production += parseFloat(record.production) || 0;
            acc[record.crop_year].total_area += parseFloat(record.area) || 0;
            return acc;
          }, {});

          const historicalArray = Object.values(yearlyData);
          const predictedProduction = predictProduction(historicalArray, cropYear);

          if (predictedProduction > 0) {
            stateProductionData.push({
              state_name: group.state_name,
              crop: group.crop,
              total_production: predictedProduction,
              total_area: 0,
            });

            await supabase.from("crop_predictions").upsert({
              state_name: group.state_name,
              crop_year: cropYear,
              crop: group.crop,
              predicted_production: predictedProduction,
              confidence_score: 0.75,
              prediction_model: "linear_regression",
            });
          }
        }
      }
    } else {
      const { data: actualData } = await supabase
        .from("crop_production_data")
        .select("state_name, crop, production, area")
        .eq("crop_year", cropYear);

      if (actualData) {
        const grouped = actualData.reduce((acc: any, record: any) => {
          const key = `${record.state_name}-${record.crop}`;
          if (!acc[key]) {
            acc[key] = {
              state_name: record.state_name,
              crop: record.crop,
              total_production: 0,
              total_area: 0,
            };
          }
          acc[key].total_production += parseFloat(record.production) || 0;
          acc[key].total_area += parseFloat(record.area) || 0;
          return acc;
        }, {});

        stateProductionData = Object.values(grouped);
      }
    }

    if (crop) {
      stateProductionData = stateProductionData.filter(d => d.crop.toLowerCase() === crop.toLowerCase());
    }

    const cropGroups = stateProductionData.reduce((acc: any, record) => {
      if (!acc[record.crop]) {
        acc[record.crop] = [];
      }
      acc[record.crop].push(record);
      return acc;
    }, {});

    const recommendations: any[] = [];

    for (const cropName in cropGroups) {
      const cropData = cropGroups[cropName];
      const avgProduction = cropData.reduce((sum: number, d: StateProduction) => sum + d.total_production, 0) / cropData.length;

      const surplus = cropData.filter((d: StateProduction) => d.total_production > avgProduction * 1.2);
      const deficit = cropData.filter((d: StateProduction) => d.total_production < avgProduction * 0.8);

      for (const deficitState of deficit) {
        const potentialSuppliers = surplus.map((surplusState: StateProduction) => {
          const distance = getDistance(surplusState.state_name, deficitState.state_name);
          const quantity = Math.min(
            surplusState.total_production - avgProduction,
            avgProduction - deficitState.total_production
          );
          const fuelCostPerKm = 8.5;
          const co2PerKm = 0.8;
          const cost = distance * fuelCostPerKm * (quantity / 1000);
          const co2 = distance * co2PerKm * (quantity / 1000);
          const priorityScore = (quantity / distance) * 1000;

          return {
            surplus_state: surplusState.state_name,
            deficit_state: deficitState.state_name,
            crop: cropName,
            crop_year: cropYear,
            recommended_quantity: quantity,
            distance_km: distance,
            estimated_cost: cost,
            estimated_co2: co2,
            priority_score: priorityScore,
          };
        }).sort((a, b) => b.priority_score - a.priority_score);

        if (potentialSuppliers.length > 0) {
          recommendations.push(potentialSuppliers[0]);
        }
      }
    }

    await supabase.from("transaction_recommendations").delete().eq("crop_year", cropYear);

    if (recommendations.length > 0) {
      await supabase.from("transaction_recommendations").insert(recommendations);
    }

    return new Response(
      JSON.stringify({
        success: true,
        crop_year: cropYear,
        recommendations_count: recommendations.length,
        recommendations: recommendations.slice(0, 20),
        is_prediction: isPrediction,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
