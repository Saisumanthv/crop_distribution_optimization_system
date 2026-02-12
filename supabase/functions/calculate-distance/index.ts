import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STATE_CAPITALS = {
  "Andhra Pradesh": "Amaravati, Andhra Pradesh, India",
  "Arunachal Pradesh": "Itanagar, Arunachal Pradesh, India",
  "Assam": "Dispur, Assam, India",
  "Bihar": "Patna, Bihar, India",
  "Chhattisgarh": "Raipur, Chhattisgarh, India",
  "Goa": "Panaji, Goa, India",
  "Gujarat": "Gandhinagar, Gujarat, India",
  "Haryana": "Chandigarh, India",
  "Himachal Pradesh": "Shimla, Himachal Pradesh, India",
  "Jharkhand": "Ranchi, Jharkhand, India",
  "Karnataka": "Bengaluru, Karnataka, India",
  "Kerala": "Thiruvananthapuram, Kerala, India",
  "Madhya Pradesh": "Bhopal, Madhya Pradesh, India",
  "Maharashtra": "Mumbai, Maharashtra, India",
  "Manipur": "Imphal, Manipur, India",
  "Meghalaya": "Shillong, Meghalaya, India",
  "Mizoram": "Aizawl, Mizoram, India",
  "Nagaland": "Kohima, Nagaland, India",
  "Odisha": "Bhubaneswar, Odisha, India",
  "Punjab": "Chandigarh, India",
  "Puducherry": "Puducherry, India",
  "Rajasthan": "Jaipur, Rajasthan, India",
  "Sikkim": "Gangtok, Sikkim, India",
  "Tamil Nadu": "Chennai, Tamil Nadu, India",
  "Telangana": "Hyderabad, Telangana, India",
  "Tripura": "Agartala, Tripura, India",
  "Uttar Pradesh": "Lucknow, Uttar Pradesh, India",
  "Uttarakhand": "Dehradun, Uttarakhand, India",
  "West Bengal": "Kolkata, West Bengal, India",
  "Delhi": "New Delhi, Delhi, India",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const origin = url.searchParams.get("origin");
    const destination = url.searchParams.get("destination");

    if (!origin || !destination) {
      return new Response(
        JSON.stringify({ error: "origin and destination are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const googleMapsApiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!googleMapsApiKey) {
      return new Response(
        JSON.stringify({
          error: "Google Maps API key not configured",
          distance_km: null,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const originAddress = STATE_CAPITALS[origin as keyof typeof STATE_CAPITALS] || origin;
    const destinationAddress = STATE_CAPITALS[destination as keyof typeof STATE_CAPITALS] || destination;

    const apiUrl = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
    apiUrl.searchParams.append("origins", originAddress);
    apiUrl.searchParams.append("destinations", destinationAddress);
    apiUrl.searchParams.append("key", googleMapsApiKey);
    apiUrl.searchParams.append("units", "metric");

    const response = await fetch(apiUrl.toString());
    const data = await response.json();

    if (data.status !== "OK") {
      return new Response(
        JSON.stringify({
          error: `Google Maps API error: ${data.status}`,
          distance_km: null,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const element = data.rows[0]?.elements[0];
    if (!element || element.status !== "OK") {
      return new Response(
        JSON.stringify({
          error: "Unable to calculate distance",
          distance_km: null,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const distanceKm = Math.round(element.distance.value / 1000);

    return new Response(
      JSON.stringify({
        origin,
        destination,
        distance_km: distanceKm,
        distance_text: element.distance.text,
        duration_text: element.duration.text,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in calculate-distance:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
        distance_km: null,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
