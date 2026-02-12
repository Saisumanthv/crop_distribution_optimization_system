import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CropRecord {
  state_name: string;
  district_name: string;
  crop_year: string;
  season: string;
  crop: string;
  area: number;
  production: number;
  yield: number;
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

    const url = new URL(req.url);
    const stateName = url.searchParams.get("state_name");
    const cropYear = url.searchParams.get("crop_year");

    if (!stateName || !cropYear) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: state_name and crop_year"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Convert crop year format from "2010-11" to 2010 (numeric first year)
    const numericYear = cropYear.split("-")[0];

    const apiUrl = "https://api.data.gov.in/resource/35be999b-0208-4354-b557-f6ca9a5355de";
    const apiKey = "579b464db66ec23bdd0000012d0652fcdf1c4c4177a3961e8b6eb3df";

    let allRecords: CropRecord[] = [];
    let offset = 0;
    const limit = 100;
    let hasMoreData = true;

    while (hasMoreData) {
      const params = new URLSearchParams({
        "api-key": apiKey,
        "format": "json",
        "offset": offset.toString(),
        "limit": limit.toString(),
        "filters[state_name]": stateName,
        "filters[crop_year]": numericYear,
      });

      const response = await fetch(`${apiUrl}?${params}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const records = data.records || [];

      if (offset === 0 && records.length === 0) {
        console.log("No records found. API Response:", JSON.stringify(data).substring(0, 500));
      }

      if (records.length === 0) {
        hasMoreData = false;
      } else {
        allRecords = allRecords.concat(records);
        offset += limit;

        if (records.length < limit) {
          hasMoreData = false;
        }
      }
    }

    if (allRecords.length > 0) {
      console.log("Sample raw record:", JSON.stringify(allRecords[0]));

      const formattedRecords = allRecords.map((record: any) => {
        const area = parseFloat(record.area_ || record.area || record.Area || "0") || 0;
        const production = parseFloat(record.production_ || record.production || record.Production || "0") || 0;
        const yieldValue = parseFloat(record.yield_ || record.yield || record.Yield || "0") || 0;

        return {
          state_name: record.state_name || stateName,
          district_name: record.district_name || "",
          crop_year: record.crop_year || cropYear,
          season: record.season || "",
          crop: record.crop || "",
          area,
          production,
          yield: yieldValue,
        };
      });

      const { error: insertError } = await supabase
        .from("crop_production_data")
        .upsert(formattedRecords, {
          onConflict: "state_name,district_name,crop_year,season,crop",
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error(`Database insert failed: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        recordsFound: allRecords.length,
        message: `Fetched and stored ${allRecords.length} records for ${stateName} (${cropYear})`,
        records: allRecords.slice(0, 10),
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
