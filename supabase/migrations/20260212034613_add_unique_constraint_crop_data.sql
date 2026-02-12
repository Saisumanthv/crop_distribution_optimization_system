/*
  # Add Unique Constraint to Crop Production Data

  1. Changes
    - Add unique constraint on (state_name, district_name, crop_year, season, crop)
      to prevent duplicate entries and enable proper upsert operations
  
  2. Notes
    - This constraint ensures data integrity when importing from data.gov.in
    - Allows the edge function to properly update existing records
*/

-- Add unique constraint to crop_production_data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'crop_production_data_unique_key'
  ) THEN
    ALTER TABLE crop_production_data
    ADD CONSTRAINT crop_production_data_unique_key 
    UNIQUE (state_name, district_name, crop_year, season, crop);
  END IF;
END $$;
