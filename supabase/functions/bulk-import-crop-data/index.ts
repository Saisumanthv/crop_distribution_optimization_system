import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const CROP_YEARS = [
  "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004",
  "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012",
  "2013", "2014"
];

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

async function fetchDataForStateYear(
  stateName: string,
  year: string,
  apiKey: string
): Promise<CropRecord[]> {
  const apiUrl = "https://api.data.gov.in/resource/35be999b-0208-4354-b557-f6ca9a5355de";
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
      "filters[crop_year]": year,
    });

    try {
      const response = await fetch(`${apiUrl}?${params}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        console.error(`API request failed for ${stateName} ${year}: ${response.statusText}`);
        break;
      }

      const data = await response.json();
      const records = data.records || [];

      if (records.length === 0) {
        hasMoreData = false;
      } else {
        allRecords = allRecords.concat(records);
        offset += limit;

        if (records.length < limit) {
          hasMoreData = false;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error fetching data for ${stateName} ${year}:`, error);
      break;
    }
  }

  return allRecords;
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

    const apiKey = "579b464db66ec23bdd0000012d0652fcdf1c4c4177a3961e8b6eb3df";

    let totalRecords = 0;
    let successfulImports = 0;
    let failedImports = 0;

    for (const state of INDIAN_STATES) {
      for (const year of CROP_YEARS) {
        console.log(`Fetching data for ${state} - ${year}...`);

        const records = await fetchDataForStateYear(state, year, apiKey);

        if (records.length > 0) {
          const cropYear = `${year}-${(parseInt(year) + 1).toString().slice(-2)}`;

          const { error: deleteError } = await supabase
            .from("crop_production_data")
            .delete()
            .eq("state_name", state)
            .eq("crop_year", cropYear);

          if (deleteError) {
            console.error(`Delete error for ${state} ${cropYear}:`, deleteError);
            failedImports++;
            continue;
          }

          const formattedRecords = records.map((record: any) => {
            const area = parseFloat(record.area_ || record.area || record.Area || "0") || 0;
            const production = parseFloat(record.production_ || record.production || record.Production || "0") || 0;
            const yieldValue = parseFloat(record.yield_ || record.yield || record.Yield || "0") || 0;

            return {
              state_name: record.state_name || state,
              district_name: record.district_name || "",
              crop_year: cropYear,
              season: record.season || "",
              crop: record.crop || "",
              area,
              production,
              yield: yieldValue,
            };
          });

          const { error: insertError } = await supabase
            .from("crop_production_data")
            .insert(formattedRecords);

          if (insertError) {
            console.error(`Insert error for ${state} ${cropYear}:`, insertError);
            failedImports++;
          } else {
            totalRecords += records.length;
            successfulImports++;
            console.log(`Successfully imported ${records.length} records for ${state} ${cropYear}`);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalRecords,
        successfulImports,
        failedImports,
        statesProcessed: INDIAN_STATES.length,
        yearsProcessed: CROP_YEARS.length,
        message: `Bulk import completed. Imported ${totalRecords} records across ${successfulImports} state-year combinations.`,
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
