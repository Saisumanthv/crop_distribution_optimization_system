/*
  # Crop Production Optimization System Schema

  ## Overview
  This migration creates a comprehensive database schema for analyzing crop production data
  and generating optimal inter-state transaction recommendations for the Indian government.

  ## New Tables

  ### 1. `states`
  Stores information about Indian states
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - State name
  - `code` (text) - State code (e.g., TG, OD, PB)
  - `region` (text) - Geographic region (North, South, East, West, Central, Northeast)
  - `population` (bigint) - State population
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `crop_production_data`
  Stores historical crop production data from data.gov.in
  - `id` (uuid, primary key) - Unique identifier
  - `state_name` (text) - Name of the state
  - `district_name` (text) - Name of the district
  - `crop_year` (text) - Crop year (e.g., "2014-15")
  - `season` (text) - Season (Kharif, Rabi, Whole Year, etc.)
  - `crop` (text) - Crop name
  - `area` (numeric) - Area under cultivation (hectares)
  - `production` (numeric) - Production quantity (tonnes)
  - `yield` (numeric) - Yield (kg per hectare)
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `state_distances`
  Stores distance and connectivity information between states
  - `id` (uuid, primary key) - Unique identifier
  - `from_state` (text) - Origin state name
  - `to_state` (text) - Destination state name
  - `distance_km` (numeric) - Road distance in kilometers
  - `avg_transport_time_hours` (numeric) - Average transportation time
  - `fuel_cost_per_km` (numeric) - Fuel cost per kilometer (INR)
  - `co2_emission_per_km` (numeric) - CO2 emissions per km (kg)
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `crop_predictions`
  Stores predicted crop production for future years
  - `id` (uuid, primary key) - Unique identifier
  - `state_name` (text) - State name
  - `crop_year` (text) - Predicted year
  - `crop` (text) - Crop name
  - `predicted_production` (numeric) - Predicted production (tonnes)
  - `confidence_score` (numeric) - Prediction confidence (0-1)
  - `prediction_model` (text) - Model used for prediction
  - `created_at` (timestamptz) - Prediction creation timestamp

  ### 5. `transaction_recommendations`
  Stores optimal transaction recommendations between states
  - `id` (uuid, primary key) - Unique identifier
  - `crop_year` (text) - Year of recommendation
  - `crop` (text) - Crop name
  - `surplus_state` (text) - State with excess production
  - `deficit_state` (text) - State needing supply
  - `recommended_quantity` (numeric) - Recommended transaction quantity (tonnes)
  - `estimated_cost` (numeric) - Estimated transportation cost (INR)
  - `estimated_co2` (numeric) - Estimated CO2 emissions (kg)
  - `distance_km` (numeric) - Distance between states
  - `priority_score` (numeric) - Priority ranking (higher = more optimal)
  - `created_at` (timestamptz) - Recommendation creation timestamp

  ## Security
  - Enable RLS on all tables
  - Allow public read access for government analytics
  - Restrict write access to authenticated users only

  ## Indexes
  - Add indexes on frequently queried columns for performance
*/

-- Create states table
CREATE TABLE IF NOT EXISTS states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  region text NOT NULL,
  population bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create crop_production_data table
CREATE TABLE IF NOT EXISTS crop_production_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_name text NOT NULL,
  district_name text NOT NULL,
  crop_year text NOT NULL,
  season text NOT NULL,
  crop text NOT NULL,
  area numeric DEFAULT 0,
  production numeric DEFAULT 0,
  yield numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create state_distances table
CREATE TABLE IF NOT EXISTS state_distances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_state text NOT NULL,
  to_state text NOT NULL,
  distance_km numeric NOT NULL,
  avg_transport_time_hours numeric DEFAULT 0,
  fuel_cost_per_km numeric DEFAULT 8.5,
  co2_emission_per_km numeric DEFAULT 0.8,
  created_at timestamptz DEFAULT now(),
  UNIQUE(from_state, to_state)
);

-- Create crop_predictions table
CREATE TABLE IF NOT EXISTS crop_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_name text NOT NULL,
  crop_year text NOT NULL,
  crop text NOT NULL,
  predicted_production numeric NOT NULL,
  confidence_score numeric DEFAULT 0.75,
  prediction_model text DEFAULT 'linear_regression',
  created_at timestamptz DEFAULT now(),
  UNIQUE(state_name, crop_year, crop)
);

-- Create transaction_recommendations table
CREATE TABLE IF NOT EXISTS transaction_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_year text NOT NULL,
  crop text NOT NULL,
  surplus_state text NOT NULL,
  deficit_state text NOT NULL,
  recommended_quantity numeric NOT NULL,
  estimated_cost numeric DEFAULT 0,
  estimated_co2 numeric DEFAULT 0,
  distance_km numeric DEFAULT 0,
  priority_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_crop_data_state_year ON crop_production_data(state_name, crop_year);
CREATE INDEX IF NOT EXISTS idx_crop_data_crop ON crop_production_data(crop);
CREATE INDEX IF NOT EXISTS idx_predictions_state_year ON crop_predictions(state_name, crop_year);
CREATE INDEX IF NOT EXISTS idx_recommendations_year ON transaction_recommendations(crop_year);
CREATE INDEX IF NOT EXISTS idx_recommendations_crop ON transaction_recommendations(crop);

-- Enable Row Level Security
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_production_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_distances ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (government analytics)
CREATE POLICY "Allow public read access to states"
  ON states FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to crop data"
  ON crop_production_data FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to distances"
  ON state_distances FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to predictions"
  ON crop_predictions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to recommendations"
  ON transaction_recommendations FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for authenticated write access
CREATE POLICY "Allow authenticated insert to crop data"
  ON crop_production_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to crop data"
  ON crop_production_data FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to predictions"
  ON crop_predictions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert to recommendations"
  ON transaction_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete from recommendations"
  ON transaction_recommendations FOR DELETE
  TO authenticated
  USING (true);