import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CropData {
  crop: string;
  season: string;
  total_production: number;
  total_area: number;
  avg_yield: number;
  district_count: number;
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

  const years = sorted.map((d) => parseInt(d.crop_year.split("-")[0]));
  const productions = sorted.map((d) => d.total_production);

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

function predictArea(historicalData: any[], targetYear: string): number {
  if (historicalData.length === 0) return 0;

  const sorted = historicalData.sort((a, b) => {
    const yearA = parseInt(a.crop_year.split("-")[0]);
    const yearB = parseInt(b.crop_year.split("-")[0]);
    return yearA - yearB;
  });

  if (sorted.length === 1) {
    return sorted[0].total_area * 1.01;
  }

  const years = sorted.map((d) => parseInt(d.crop_year.split("-")[0]));
  const areas = sorted.map((d) => d.total_area);

  const n = years.length;
  const sumX = years.reduce((a, b) => a + b, 0);
  const sumY = areas.reduce((a, b) => a + b, 0);
  const sumXY = years.reduce((sum, x, i) => sum + x * areas[i], 0);
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
    const stateName = searchParams.get("state_name");
    const cropYear = searchParams.get("crop_year");
    const crop = searchParams.get("crop");

    if (!stateName || !cropYear) {
      return new Response(
        JSON.stringify({ error: "state_name and crop_year parameters are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetYearNum = parseInt(cropYear.split("-")[0]);
    const isPrediction = targetYearNum > 2015;

    let cropStrategies: CropData[] = [];

    if (isPrediction) {
      const { data: historicalData } = await supabase
        .from("crop_production_data")
        .select("crop, season, production, area, crop_year")
        .eq("state_name", stateName);

      if (historicalData) {
        const groupedData = historicalData.reduce((acc: any, record: any) => {
          const key = `${record.crop}-${record.season}`;
          if (!acc[key]) {
            acc[key] = {
              crop: record.crop,
              season: record.season,
              records: [],
            };
          }
          acc[key].records.push(record);
          return acc;
        }, {});

        for (const key in groupedData) {
          const group = groupedData[key];
          const yearlyData = group.records.reduce((acc: any, record: any) => {
            if (!acc[record.crop_year]) {
              acc[record.crop_year] = {
                total_production: 0,
                total_area: 0,
                crop_year: record.crop_year,
              };
            }
            acc[record.crop_year].total_production += parseFloat(record.production) || 0;
            acc[record.crop_year].total_area += parseFloat(record.area) || 0;
            return acc;
          }, {});

          const historicalArray = Object.values(yearlyData);
          const predictedProduction = predictProduction(historicalArray, cropYear);
          const predictedArea = predictArea(historicalArray, cropYear);

          if (predictedProduction > 0 && predictedArea > 0) {
            cropStrategies.push({
              crop: group.crop,
              season: group.season,
              total_production: predictedProduction,
              total_area: predictedArea,
              avg_yield: predictedProduction / predictedArea,
              district_count: group.records.length,
            });
          }
        }
      }
    } else {
      const { data: actualData } = await supabase
        .from("crop_production_data")
        .select("crop, season, production, area, district_name")
        .eq("state_name", stateName)
        .eq("crop_year", cropYear);

      if (actualData) {
        const grouped = actualData.reduce((acc: any, record: any) => {
          const key = `${record.crop}-${record.season}`;
          if (!acc[key]) {
            acc[key] = {
              crop: record.crop,
              season: record.season,
              total_production: 0,
              total_area: 0,
              districts: new Set(),
            };
          }
          acc[key].total_production += parseFloat(record.production) || 0;
          acc[key].total_area += parseFloat(record.area) || 0;
          acc[key].districts.add(record.district_name);
          return acc;
        }, {});

        cropStrategies = Object.values(grouped).map((g: any) => ({
          crop: g.crop,
          season: g.season,
          total_production: g.total_production,
          total_area: g.total_area,
          avg_yield: g.total_area > 0 ? g.total_production / g.total_area : 0,
          district_count: g.districts.size,
        }));
      }
    }

    if (crop) {
      cropStrategies = cropStrategies.filter((d) => d.crop.toLowerCase() === crop.toLowerCase());
    }

    const strategies: any[] = cropStrategies
      .filter((s) => s.avg_yield > 0)
      .sort((a, b) => b.avg_yield - a.avg_yield)
      .map((strategy, index) => {
        const priorityScore = strategy.avg_yield * strategy.total_production / 1000;
        const strategyNotes = index < 3
          ? `High priority: Excellent yield of ${strategy.avg_yield.toFixed(2)} tonnes/hectare. Consider expanding cultivation.`
          : strategy.avg_yield > 1.5
          ? `Moderate priority: Good yield potential. Monitor and optimize growing conditions.`
          : `Low priority: Below average yield. Consider soil testing and improved farming techniques.`;

        return {
          state_name: stateName,
          crop_year: cropYear,
          crop: strategy.crop,
          season: strategy.season,
          recommended_area: Math.round(strategy.total_area),
          predicted_yield: parseFloat(strategy.avg_yield.toFixed(2)),
          predicted_production: Math.round(strategy.total_production),
          priority_score: parseFloat(priorityScore.toFixed(2)),
          strategy_notes: strategyNotes,
        };
      });

    await supabase.from("crop_strategies").delete().eq("state_name", stateName).eq("crop_year", cropYear);

    if (strategies.length > 0) {
      await supabase.from("crop_strategies").insert(strategies);
    }

    return new Response(
      JSON.stringify({
        success: true,
        state_name: stateName,
        crop_year: cropYear,
        strategies_count: strategies.length,
        strategies: strategies,
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
