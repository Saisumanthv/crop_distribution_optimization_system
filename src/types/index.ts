export interface CropData {
  id: string;
  state_name: string;
  district_name: string;
  crop_year: string;
  season: string;
  crop: string;
  area: number;
  production: number;
  yield: number;
  created_at: string;
}

export interface Recommendation {
  id: string;
  crop_year: string;
  crop: string;
  surplus_state: string;
  deficit_state: string;
  recommended_quantity: number;
  estimated_cost: number;
  estimated_co2: number;
  distance_km: number;
  priority_score: number;
  created_at: string;
}

export interface CropPrediction {
  id: string;
  state_name: string;
  crop_year: string;
  crop: string;
  predicted_production: number;
  confidence_score: number;
  prediction_model: string;
  created_at: string;
}

export interface StateSummary {
  state_name: string;
  crop: string;
  total_production: number;
  is_surplus: boolean;
  is_deficit: boolean;
}
