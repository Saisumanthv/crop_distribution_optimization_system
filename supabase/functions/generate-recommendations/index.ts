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
  historical_trend: string;
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

function getTrend(historicalData: any[]): string {
  if (historicalData.length < 2) return "stable";

  const sorted = historicalData.sort((a, b) => {
    const yearA = parseInt(a.crop_year.split("-")[0]);
    const yearB = parseInt(b.crop_year.split("-")[0]);
    return yearA - yearB;
  });

  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

  const avgFirst = firstHalf.reduce((sum, d) => sum + d.total_production, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, d) => sum + d.total_production, 0) / secondHalf.length;

  const change = ((avgSecond - avgFirst) / avgFirst) * 100;

  if (change > 10) return "increasing";
  if (change < -10) return "decreasing";
  return "stable";
}

async function getAIRecommendations(cropStrategies: CropData[], stateName: string, cropYear: string, openaiKey: string): Promise<any[]> {
  try {
    const topCrops = cropStrategies
      .sort((a, b) => (b.total_production * b.avg_yield) - (a.total_production * a.avg_yield))
      .slice(0, 10);

    const riceCrop = topCrops.find(c => c.crop.toLowerCase() === 'rice');
    const riceContext = stateName === 'Andhra Pradesh' && riceCrop
      ? `\n\nIMPORTANT: Rice is the staple and dominant crop of Andhra Pradesh with the highest production (${(riceCrop.total_production / 1000000).toFixed(2)} million tonnes). It MUST receive the highest priority score (90-95) as it's critical to the state's food security and economy.`
      : '';

    const prompt = `You are an agricultural expert analyzing crop production data for ${stateName} for the year ${cropYear}.

Here are the top crops with their performance metrics:

${topCrops.map((c, i) => `${i + 1}. ${c.crop} (${c.season} season)
   - Total Production: ${(c.total_production / 1000000).toFixed(2)} million tonnes
   - Cultivation Area: ${(c.total_area / 1000).toFixed(2)}K hectares
   - Average Yield: ${c.avg_yield.toFixed(2)} tonnes/hectare
   - Trend: ${c.historical_trend}
   - Districts Growing: ${c.district_count}`).join('\n\n')}${riceContext}

For each of these top 10 crops, provide:
1. A priority score (0-100) based on production volume, yield potential, regional importance, and trend
2. A specific, actionable recommendation (2-3 sentences) for farmers

Scoring Guidelines:
- Crops with highest production volume should get priority (85-95)
- High-yielding crops with good trends get 70-85
- Moderate performers get 50-70
- Lower priority crops get 30-50
- Rice in Andhra Pradesh: 90-95 (staple crop)
- Consider economic viability and market demand

Respond ONLY with a valid JSON array in this exact format:
[
  {
    "crop": "Crop Name",
    "season": "Season",
    "priority_score": 85,
    "recommendation": "Specific recommendation here"
  }
]`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert agricultural analyst. Respond only with valid JSON arrays. No explanations outside the JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return [];
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    if (!content) return [];

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return [];
  }
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
    const openaiKey = searchParams.get("openai_key");

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
          const trend = getTrend(historicalArray);

          if (predictedProduction > 0 && predictedArea > 0) {
            cropStrategies.push({
              crop: group.crop,
              season: group.season,
              total_production: predictedProduction,
              total_area: predictedArea,
              avg_yield: predictedProduction / predictedArea,
              district_count: group.records.length,
              historical_trend: trend,
            });
          }
        }
      }
    } else {
      const { data: actualData } = await supabase
        .from("crop_production_data")
        .select("crop, season, production, area, district_name, crop_year")
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
              records: [],
            };
          }
          acc[key].total_production += parseFloat(record.production) || 0;
          acc[key].total_area += parseFloat(record.area) || 0;
          acc[key].districts.add(record.district_name);
          acc[key].records.push({ crop_year: record.crop_year, total_production: parseFloat(record.production) || 0 });
          return acc;
        }, {});

        cropStrategies = Object.values(grouped).map((g: any) => ({
          crop: g.crop,
          season: g.season,
          total_production: g.total_production,
          total_area: g.total_area,
          avg_yield: g.total_area > 0 ? g.total_production / g.total_area : 0,
          district_count: g.districts.size,
          historical_trend: "actual",
        }));
      }
    }

    if (crop) {
      cropStrategies = cropStrategies.filter((d) => d.crop.toLowerCase() === crop.toLowerCase());
    }

    const validStrategies = cropStrategies.filter((s) => s.avg_yield > 0 && s.total_production > 0);

    let aiRecommendations: any[] = [];
    if (openaiKey && validStrategies.length > 0) {
      aiRecommendations = await getAIRecommendations(validStrategies, stateName, cropYear, openaiKey);
    }

    const strategies: any[] = validStrategies
      .sort((a, b) => (b.total_production * b.avg_yield) - (a.total_production * a.avg_yield))
      .slice(0, 20)
      .map((strategy) => {
        const aiRec = aiRecommendations.find(
          (r) => r.crop.toLowerCase() === strategy.crop.toLowerCase() && r.season.toLowerCase() === strategy.season.toLowerCase()
        );

        const basePriorityScore = (strategy.avg_yield * strategy.total_production) / 1000000;
        const priorityScore = aiRec ? aiRec.priority_score : Math.min(100, basePriorityScore / 1000);

        const strategyNotes = aiRec
          ? aiRec.recommendation
          : priorityScore > 70
          ? `High priority: Excellent yield of ${strategy.avg_yield.toFixed(2)} tonnes/hectare with strong production of ${(strategy.total_production / 1000000).toFixed(2)}M tonnes. ${strategy.historical_trend === "increasing" ? "Production is trending upward." : "Maintain current practices."}`
          : priorityScore > 40
          ? `Moderate priority: Good yield potential with ${(strategy.total_production / 1000000).toFixed(2)}M tonnes production. Monitor and optimize growing conditions.`
          : `Consider evaluation: Yield of ${strategy.avg_yield.toFixed(2)} tonnes/hectare. Explore soil testing and improved farming techniques.`;

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
        ai_powered: aiRecommendations.length > 0,
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
