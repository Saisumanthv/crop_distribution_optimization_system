/*
  # Expand Dataset to 40,000+ Records

  1. Strategy
    - Add more years (2003-04, 2004, 2006-07, 2007-08)
    - Generate more crop combinations per district-season
    - Target: Expand from ~15k to 40k+ total records

  2. Additions
    - 4 additional years × 160 districts × 2 seasons × 8 crops = ~10,240 records
    - Plus additional whole year crops
    - Total target: 40,000+ records
*/

-- Add comprehensive data for additional years
DO $$
DECLARE
  states_arr TEXT[] := ARRAY['Andhra Pradesh', 'Assam', 'Haryana', 'Karnataka', 'Maharashtra', 'Punjab', 'Tamil Nadu', 'Uttar Pradesh'];
  
  ap_dists TEXT[] := ARRAY['Guntur', 'Krishna', 'Visakhapatnam', 'East Godavari', 'West Godavari', 'Chittoor', 'Kadapa', 'Kurnool', 'Anantapur', 'Nellore', 'Prakasam', 'Srikakulam', 'Vizianagaram', 'Medak', 'Nizamabad', 'Adilabad', 'Karimnagar', 'Warangal', 'Khammam', 'Mahbubnagar'];
  
  assam_dists TEXT[] := ARRAY['Kamrup', 'Barpeta', 'Dibrugarh', 'Nagaon', 'Sonitpur', 'Cachar', 'Dhubri', 'Jorhat', 'Golaghat', 'Sivasagar', 'Darrang', 'Lakhimpur', 'Bongaigaon', 'Kokrajhar', 'Tinsukia', 'Goalpara', 'Karbi Anglong', 'Morigaon', 'Nalbari', 'Hailakandi'];
  
  haryana_dists TEXT[] := ARRAY['Karnal', 'Ambala', 'Hisar', 'Panipat', 'Rohtak', 'Sonipat', 'Kurukshetra', 'Yamunanagar', 'Sirsa', 'Fatehabad', 'Jhajjar', 'Jind', 'Kaithal', 'Bhiwani', 'Mahendragarh', 'Rewari', 'Gurgaon', 'Faridabad', 'Palwal', 'Panchkula'];
  
  karnataka_dists TEXT[] := ARRAY['Bangalore', 'Mysore', 'Belgaum', 'Mandya', 'Tumkur', 'Bidar', 'Raichur', 'Gulbarga', 'Bellary', 'Chitradurga', 'Davangere', 'Haveri', 'Shimoga', 'Hassan', 'Dharwad', 'Bagalkot', 'Gadag', 'Koppal', 'Bijapur', 'Yadgir'];
  
  maharashtra_dists TEXT[] := ARRAY['Nagpur', 'Pune', 'Nashik', 'Ahmednagar', 'Solapur', 'Mumbai', 'Thane', 'Aurangabad', 'Jalgaon', 'Kolhapur', 'Sangli', 'Satara', 'Dhule', 'Nanded', 'Amravati', 'Akola', 'Yavatmal', 'Wardha', 'Bhandara', 'Latur'];
  
  punjab_dists TEXT[] := ARRAY['Amritsar', 'Ludhiana', 'Patiala', 'Bathinda', 'Jalandhar', 'Ferozepur', 'Sangrur', 'Moga', 'Hoshiarpur', 'Kapurthala', 'Gurdaspur', 'Muktsar', 'Faridkot', 'Mansa', 'Fatehgarh Sahib', 'Mohali', 'Rupnagar', 'Nawanshahr', 'Tarn Taran', 'Barnala'];
  
  tn_dists TEXT[] := ARRAY['Coimbatore', 'Thanjavur', 'Erode', 'Salem', 'Madurai', 'Tirunelveli', 'Tiruchirappalli', 'Vellore', 'Tiruppur', 'Dindigul', 'Kanyakumari', 'Viluppuram', 'Cuddalore', 'Nagapattinam', 'Namakkal', 'Pudukkottai', 'Karur', 'Theni', 'Krishnagiri', 'Ariyalur'];
  
  up_dists TEXT[] := ARRAY['Meerut', 'Agra', 'Lucknow', 'Gorakhpur', 'Varanasi', 'Allahabad', 'Kanpur', 'Bareilly', 'Moradabad', 'Saharanpur', 'Ghaziabad', 'Aligarh', 'Muzaffarnagar', 'Bijnor', 'Mathura', 'Firozabad', 'Etah', 'Mainpuri', 'Budaun', 'Rampur'];
  
  crops_arr TEXT[] := ARRAY['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Bajra', 'Jowar', 'Groundnut', 'Sunflower', 'Soyabean', 'Tur', 'Gram', 'Barley', 'Jute', 'Mesta', 'Sesamum', 'Rapeseed', 'Mustard', 'Linseed', 'Castor'];
  
  new_years TEXT[] := ARRAY['2003-04', '2004', '2006-07', '2007-08'];
  
  v_state TEXT;
  v_districts TEXT[];
  v_district TEXT;
  v_year TEXT;
  v_season TEXT;
  v_crop TEXT;
  v_area NUMERIC;
  v_production NUMERIC;
  v_yield NUMERIC;
  
  state_idx INTEGER;
  district_idx INTEGER;
  year_idx INTEGER;
  crop_idx INTEGER;
  
BEGIN
  -- Loop through each state
  FOR state_idx IN 1..array_length(states_arr, 1) LOOP
    v_state := states_arr[state_idx];
    
    -- Select districts based on state
    CASE v_state
      WHEN 'Andhra Pradesh' THEN v_districts := ap_dists;
      WHEN 'Assam' THEN v_districts := assam_dists;
      WHEN 'Haryana' THEN v_districts := haryana_dists;
      WHEN 'Karnataka' THEN v_districts := karnataka_dists;
      WHEN 'Maharashtra' THEN v_districts := maharashtra_dists;
      WHEN 'Punjab' THEN v_districts := punjab_dists;
      WHEN 'Tamil Nadu' THEN v_districts := tn_dists;
      WHEN 'Uttar Pradesh' THEN v_districts := up_dists;
    END CASE;
    
    -- Loop through each district
    FOR district_idx IN 1..array_length(v_districts, 1) LOOP
      v_district := v_districts[district_idx];
      
      -- Loop through new years
      FOR year_idx IN 1..array_length(new_years, 1) LOOP
        v_year := new_years[year_idx];
        
        -- Kharif season - generate 7-8 different crops
        FOR crop_idx IN 1..8 LOOP
          v_crop := crops_arr[((crop_idx - 1) * 2 + 1)];
          v_season := 'Kharif';
          
          v_area := (50000 + random() * 150000);
          
          IF v_crop IN ('Rice', 'Wheat') THEN
            v_yield := (2500 + random() * 3500);
          ELSIF v_crop IN ('Cotton', 'Jute') THEN
            v_yield := (1000 + random() * 800);
          ELSIF v_crop = 'Sugarcane' THEN
            v_yield := (55000 + random() * 30000);
          ELSE
            v_yield := (1200 + random() * 2000);
          END IF;
          
          v_production := ROUND(v_area * v_yield);
          
          INSERT INTO crop_production_data (state_name, district_name, crop_year, season, crop, area, production, yield)
          VALUES (v_state, v_district, v_year, v_season, v_crop, ROUND(v_area), ROUND(v_production), ROUND(v_yield))
          ON CONFLICT (state_name, district_name, crop_year, season, crop) DO NOTHING;
        END LOOP;
        
        -- Rabi season - generate 7-8 different crops
        FOR crop_idx IN 1..8 LOOP
          v_crop := crops_arr[((crop_idx - 1) * 2 + 2)];
          v_season := 'Rabi';
          
          v_area := (50000 + random() * 150000);
          
          IF v_crop IN ('Rice', 'Wheat') THEN
            v_yield := (2500 + random() * 3500);
          ELSIF v_crop IN ('Cotton', 'Jute') THEN
            v_yield := (1000 + random() * 800);
          ELSIF v_crop = 'Sugarcane' THEN
            v_yield := (55000 + random() * 30000);
          ELSE
            v_yield := (1200 + random() * 2000);
          END IF;
          
          v_production := ROUND(v_area * v_yield);
          
          INSERT INTO crop_production_data (state_name, district_name, crop_year, season, crop, area, production, yield)
          VALUES (v_state, v_district, v_year, v_season, v_crop, ROUND(v_area), ROUND(v_production), ROUND(v_yield))
          ON CONFLICT (state_name, district_name, crop_year, season, crop) DO NOTHING;
        END LOOP;
        
        -- Whole Year crops
        IF random() > 0.6 THEN
          v_area := (40000 + random() * 60000);
          v_yield := (55000 + random() * 30000);
          v_production := ROUND(v_area * v_yield);
          
          INSERT INTO crop_production_data (state_name, district_name, crop_year, season, crop, area, production, yield)
          VALUES (v_state, v_district, v_year, 'Whole Year', 'Sugarcane', ROUND(v_area), ROUND(v_production), ROUND(v_yield))
          ON CONFLICT (state_name, district_name, crop_year, season, crop) DO NOTHING;
        END IF;
        
      END LOOP;
    END LOOP;
  END LOOP;
  
  -- Add more crop diversity to existing years
  FOR state_idx IN 1..array_length(states_arr, 1) LOOP
    v_state := states_arr[state_idx];
    
    CASE v_state
      WHEN 'Andhra Pradesh' THEN v_districts := ap_dists;
      WHEN 'Assam' THEN v_districts := assam_dists;
      WHEN 'Haryana' THEN v_districts := haryana_dists;
      WHEN 'Karnataka' THEN v_districts := karnataka_dists;
      WHEN 'Maharashtra' THEN v_districts := maharashtra_dists;
      WHEN 'Punjab' THEN v_districts := punjab_dists;
      WHEN 'Tamil Nadu' THEN v_districts := tn_dists;
      WHEN 'Uttar Pradesh' THEN v_districts := up_dists;
    END CASE;
    
    FOR district_idx IN 1..array_length(v_districts, 1) LOOP
      v_district := v_districts[district_idx];
      
      -- Add more crops to years 2010-11, 2011-12, 2012-13
      FOR v_year IN SELECT unnest(ARRAY['2010-11', '2011-12', '2012-13']) LOOP
        
        -- Add additional Kharif crops (positions 10-15)
        FOR crop_idx IN 10..15 LOOP
          IF crop_idx <= array_length(crops_arr, 1) THEN
            v_crop := crops_arr[crop_idx];
            v_season := 'Kharif';
            
            v_area := (40000 + random() * 120000);
            
            IF v_crop IN ('Rice', 'Wheat') THEN
              v_yield := (2500 + random() * 3500);
            ELSIF v_crop IN ('Cotton', 'Jute') THEN
              v_yield := (1000 + random() * 800);
            ELSE
              v_yield := (1200 + random() * 2000);
            END IF;
            
            v_production := ROUND(v_area * v_yield);
            
            INSERT INTO crop_production_data (state_name, district_name, crop_year, season, crop, area, production, yield)
            VALUES (v_state, v_district, v_year, v_season, v_crop, ROUND(v_area), ROUND(v_production), ROUND(v_yield))
            ON CONFLICT (state_name, district_name, crop_year, season, crop) DO NOTHING;
          END IF;
        END LOOP;
        
        -- Add additional Rabi crops (positions 16-20)
        FOR crop_idx IN 16..20 LOOP
          IF crop_idx <= array_length(crops_arr, 1) THEN
            v_crop := crops_arr[crop_idx];
            v_season := 'Rabi';
            
            v_area := (40000 + random() * 120000);
            
            IF v_crop IN ('Rice', 'Wheat') THEN
              v_yield := (2500 + random() * 3500);
            ELSIF v_crop IN ('Cotton', 'Jute') THEN
              v_yield := (1000 + random() * 800);
            ELSE
              v_yield := (1200 + random() * 2000);
            END IF;
            
            v_production := ROUND(v_area * v_yield);
            
            INSERT INTO crop_production_data (state_name, district_name, crop_year, season, crop, area, production, yield)
            VALUES (v_state, v_district, v_year, v_season, v_crop, ROUND(v_area), ROUND(v_production), ROUND(v_yield))
            ON CONFLICT (state_name, district_name, crop_year, season, crop) DO NOTHING;
          END IF;
        END LOOP;
        
      END LOOP;
    END LOOP;
  END LOOP;
  
END $$;
