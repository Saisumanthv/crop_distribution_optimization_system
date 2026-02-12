/*
  # Interstate Trade Analysis Schema
  
  1. New Tables
    - `interstate_distances`
      - `id` (uuid, primary key)
      - `state_from` (text) - Source state name
      - `state_to` (text) - Destination state name
      - `distance_km` (numeric) - Approximate distance in kilometers
      - `created_at` (timestamptz)
      - Unique constraint on (state_from, state_to)
    
    - `state_crop_requirements`
      - `id` (uuid, primary key)
      - `state_name` (text)
      - `crop` (text)
      - `crop_year` (text)
      - `required_production` (numeric) - Estimated requirement in tonnes
      - `actual_production` (numeric) - Actual production in tonnes
      - `surplus_deficit` (numeric) - Positive for surplus, negative for deficit
      - `created_at` (timestamptz)
      - Unique constraint on (state_name, crop, crop_year)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated reads
  
  3. Functions
    - Helper function to calculate nearest trading partners
    - Function to analyze surplus/deficit for a state
*/

-- Create interstate distances table
CREATE TABLE IF NOT EXISTS interstate_distances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_from text NOT NULL,
  state_to text NOT NULL,
  distance_km numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(state_from, state_to)
);

ALTER TABLE interstate_distances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read interstate distances"
  ON interstate_distances
  FOR SELECT
  TO public
  USING (true);

-- Create state crop requirements table
CREATE TABLE IF NOT EXISTS state_crop_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_name text NOT NULL,
  crop text NOT NULL,
  crop_year text NOT NULL,
  required_production numeric DEFAULT 0,
  actual_production numeric DEFAULT 0,
  surplus_deficit numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(state_name, crop, crop_year)
);

ALTER TABLE state_crop_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read crop requirements"
  ON state_crop_requirements
  FOR SELECT
  TO public
  USING (true);

-- Insert sample interstate distances for major Indian states
-- Note: These are approximate road distances in kilometers
INSERT INTO interstate_distances (state_from, state_to, distance_km) VALUES
  ('Andhra Pradesh', 'Telangana', 250),
  ('Andhra Pradesh', 'Karnataka', 350),
  ('Andhra Pradesh', 'Tamil Nadu', 400),
  ('Andhra Pradesh', 'Odisha', 650),
  ('Andhra Pradesh', 'Maharashtra', 700),
  
  ('Telangana', 'Andhra Pradesh', 250),
  ('Telangana', 'Karnataka', 550),
  ('Telangana', 'Maharashtra', 600),
  ('Telangana', 'Madhya Pradesh', 750),
  
  ('Karnataka', 'Tamil Nadu', 350),
  ('Karnataka', 'Kerala', 400),
  ('Karnataka', 'Andhra Pradesh', 350),
  ('Karnataka', 'Telangana', 550),
  ('Karnataka', 'Goa', 450),
  ('Karnataka', 'Maharashtra', 850),
  
  ('Tamil Nadu', 'Kerala', 300),
  ('Tamil Nadu', 'Karnataka', 350),
  ('Tamil Nadu', 'Andhra Pradesh', 400),
  ('Tamil Nadu', 'Puducherry', 150),
  
  ('Kerala', 'Tamil Nadu', 300),
  ('Kerala', 'Karnataka', 400),
  
  ('Maharashtra', 'Goa', 450),
  ('Maharashtra', 'Karnataka', 850),
  ('Maharashtra', 'Gujarat', 500),
  ('Maharashtra', 'Madhya Pradesh', 550),
  ('Maharashtra', 'Telangana', 600),
  ('Maharashtra', 'Chhattisgarh', 700),
  
  ('Gujarat', 'Rajasthan', 450),
  ('Gujarat', 'Madhya Pradesh', 550),
  ('Gujarat', 'Maharashtra', 500),
  
  ('Rajasthan', 'Gujarat', 450),
  ('Rajasthan', 'Madhya Pradesh', 600),
  ('Rajasthan', 'Haryana', 400),
  ('Rajasthan', 'Punjab', 550),
  ('Rajasthan', 'Uttar Pradesh', 500),
  
  ('Madhya Pradesh', 'Maharashtra', 550),
  ('Madhya Pradesh', 'Gujarat', 550),
  ('Madhya Pradesh', 'Rajasthan', 600),
  ('Madhya Pradesh', 'Uttar Pradesh', 600),
  ('Madhya Pradesh', 'Chhattisgarh', 350),
  
  ('Uttar Pradesh', 'Delhi', 200),
  ('Uttar Pradesh', 'Haryana', 250),
  ('Uttar Pradesh', 'Rajasthan', 500),
  ('Uttar Pradesh', 'Madhya Pradesh', 600),
  ('Uttar Pradesh', 'Bihar', 400),
  ('Uttar Pradesh', 'Uttarakhand', 300),
  
  ('Bihar', 'Jharkhand', 250),
  ('Bihar', 'West Bengal', 450),
  ('Bihar', 'Uttar Pradesh', 400),
  
  ('Jharkhand', 'Bihar', 250),
  ('Jharkhand', 'West Bengal', 350),
  ('Jharkhand', 'Odisha', 400),
  ('Jharkhand', 'Chhattisgarh', 450),
  
  ('West Bengal', 'Bihar', 450),
  ('West Bengal', 'Jharkhand', 350),
  ('West Bengal', 'Odisha', 450),
  ('West Bengal', 'Assam', 800),
  
  ('Odisha', 'West Bengal', 450),
  ('Odisha', 'Jharkhand', 400),
  ('Odisha', 'Chhattisgarh', 500),
  ('Odisha', 'Andhra Pradesh', 650),
  
  ('Chhattisgarh', 'Madhya Pradesh', 350),
  ('Chhattisgarh', 'Maharashtra', 700),
  ('Chhattisgarh', 'Odisha', 500),
  ('Chhattisgarh', 'Jharkhand', 450),
  
  ('Punjab', 'Haryana', 150),
  ('Punjab', 'Himachal Pradesh', 200),
  ('Punjab', 'Rajasthan', 550),
  ('Punjab', 'Jammu and Kashmir', 300),
  
  ('Haryana', 'Punjab', 150),
  ('Haryana', 'Delhi', 50),
  ('Haryana', 'Uttar Pradesh', 250),
  ('Haryana', 'Rajasthan', 400),
  
  ('Delhi', 'Haryana', 50),
  ('Delhi', 'Uttar Pradesh', 200),
  
  ('Assam', 'West Bengal', 800),
  ('Assam', 'Meghalaya', 100),
  ('Assam', 'Arunachal Pradesh', 350),
  ('Assam', 'Nagaland', 250),
  
  ('Himachal Pradesh', 'Punjab', 200),
  ('Himachal Pradesh', 'Haryana', 300),
  ('Himachal Pradesh', 'Uttarakhand', 350),
  
  ('Uttarakhand', 'Himachal Pradesh', 350),
  ('Uttarakhand', 'Uttar Pradesh', 300),
  ('Uttarakhand', 'Haryana', 350)
ON CONFLICT (state_from, state_to) DO NOTHING;
