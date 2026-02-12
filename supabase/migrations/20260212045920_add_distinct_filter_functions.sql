/*
  # Add RPC Functions for Distinct Filters

  1. New Functions
    - `get_distinct_states()` - Returns all distinct state names, sorted alphabetically
    - `get_distinct_years()` - Returns all distinct crop years, sorted by year descending

  2. Purpose
    - Efficiently retrieve unique values for filter dropdowns
    - Avoid fetching all records just to get distinct values
    - Improve performance by using database-level DISTINCT operations
*/

-- Function to get distinct states
CREATE OR REPLACE FUNCTION get_distinct_states()
RETURNS TABLE (state_name text)
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT crop_production_data.state_name
  FROM crop_production_data
  ORDER BY crop_production_data.state_name;
$$;

-- Function to get distinct years
CREATE OR REPLACE FUNCTION get_distinct_years()
RETURNS TABLE (crop_year text)
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT crop_production_data.crop_year
  FROM crop_production_data
  ORDER BY crop_production_data.crop_year DESC;
$$;
