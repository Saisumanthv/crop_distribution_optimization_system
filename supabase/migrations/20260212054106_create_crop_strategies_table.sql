/*
  # Create Crop Growing Strategies Table

  1. New Tables
    - `crop_strategies`
      - `id` (uuid, primary key) - Unique identifier
      - `state_name` (text) - State where strategy applies
      - `crop_year` (text) - Target year for strategy
      - `crop` (text) - Crop name
      - `season` (text) - Recommended season (Kharif, Rabi, Whole Year)
      - `recommended_area` (numeric) - Recommended cultivation area in hectares
      - `predicted_yield` (numeric) - Expected yield per hectare
      - `predicted_production` (numeric) - Total expected production
      - `priority_score` (numeric) - Priority ranking (higher is better)
      - `strategy_notes` (text) - Additional strategy recommendations
      - `created_at` (timestamptz) - Timestamp when created

  2. Security
    - Enable RLS on `crop_strategies` table
    - Add policy for public read access
    - Add policy for service role write access
*/

-- Create crop strategies table
CREATE TABLE IF NOT EXISTS crop_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_name text NOT NULL,
  crop_year text NOT NULL,
  crop text NOT NULL,
  season text,
  recommended_area numeric DEFAULT 0,
  predicted_yield numeric DEFAULT 0,
  predicted_production numeric DEFAULT 0,
  priority_score numeric DEFAULT 0,
  strategy_notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE crop_strategies ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can read crop strategies"
  ON crop_strategies
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to read
CREATE POLICY "Authenticated users can read strategies"
  ON crop_strategies
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for service role to insert/update/delete
CREATE POLICY "Service role can manage strategies"
  ON crop_strategies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_crop_strategies_state_year 
  ON crop_strategies(state_name, crop_year);

CREATE INDEX IF NOT EXISTS idx_crop_strategies_crop 
  ON crop_strategies(crop);
