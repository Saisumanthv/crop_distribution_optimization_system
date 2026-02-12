/*
  # Populate Sample Crop Production Data

  This migration populates the database with comprehensive sample crop production data
  from major agricultural states across multiple years. This data represents typical
  crop production patterns and enables the application to function without external API calls.

  1. Data Coverage
    - States: Punjab, Haryana, Karnataka, Maharashtra, Tamil Nadu, Uttar Pradesh
    - Years: 2008-09 through 2013-14
    - Crops: Rice, Wheat, Cotton, Sugarcane, Maize, Bajra, Jowar, Groundnut, etc.
    - Seasons: Kharif, Rabi, Whole Year

  2. Data Source
    - Based on typical Indian crop production patterns
    - Area in hectares
    - Production in tonnes
    - Yield in kg/hectare
*/

INSERT INTO crop_production_data (state_name, district_name, crop_year, season, crop, area, production, yield) VALUES
-- Punjab 2012-13 data
('Punjab', 'Amritsar', '2012-13', 'Kharif', 'Rice', 125000, 625000, 5000),
('Punjab', 'Amritsar', '2012-13', 'Rabi', 'Wheat', 135000, 810000, 6000),
('Punjab', 'Ludhiana', '2012-13', 'Kharif', 'Rice', 150000, 780000, 5200),
('Punjab', 'Ludhiana', '2012-13', 'Rabi', 'Wheat', 160000, 1040000, 6500),
('Punjab', 'Patiala', '2012-13', 'Kharif', 'Rice', 110000, 572000, 5200),
('Punjab', 'Patiala', '2012-13', 'Rabi', 'Wheat', 120000, 720000, 6000),
('Punjab', 'Jalandhar', '2012-13', 'Kharif', 'Rice', 95000, 475000, 5000),
('Punjab', 'Jalandhar', '2012-13', 'Rabi', 'Wheat', 100000, 580000, 5800),
('Punjab', 'Bathinda', '2012-13', 'Kharif', 'Cotton', 85000, 127500, 1500),
('Punjab', 'Bathinda', '2012-13', 'Rabi', 'Wheat', 90000, 540000, 6000),

-- Punjab 2011-12 data
('Punjab', 'Amritsar', '2011-12', 'Kharif', 'Rice', 120000, 600000, 5000),
('Punjab', 'Amritsar', '2011-12', 'Rabi', 'Wheat', 130000, 754000, 5800),
('Punjab', 'Ludhiana', '2011-12', 'Kharif', 'Rice', 145000, 754000, 5200),
('Punjab', 'Ludhiana', '2011-12', 'Rabi', 'Wheat', 155000, 992000, 6400),
('Punjab', 'Patiala', '2011-12', 'Kharif', 'Rice', 105000, 525000, 5000),
('Punjab', 'Patiala', '2011-12', 'Rabi', 'Wheat', 115000, 667000, 5800),

-- Haryana 2012-13 data
('Haryana', 'Karnal', '2012-13', 'Kharif', 'Rice', 95000, 456000, 4800),
('Haryana', 'Karnal', '2012-13', 'Rabi', 'Wheat', 105000, 630000, 6000),
('Haryana', 'Ambala', '2012-13', 'Kharif', 'Rice', 75000, 352500, 4700),
('Haryana', 'Ambala', '2012-13', 'Rabi', 'Wheat', 85000, 493000, 5800),
('Haryana', 'Hisar', '2012-13', 'Kharif', 'Bajra', 90000, 225000, 2500),
('Haryana', 'Hisar', '2012-13', 'Rabi', 'Wheat', 95000, 551000, 5800),
('Haryana', 'Panipat', '2012-13', 'Kharif', 'Rice', 65000, 312000, 4800),
('Haryana', 'Panipat', '2012-13', 'Rabi', 'Wheat', 70000, 420000, 6000),
('Haryana', 'Rohtak', '2012-13', 'Kharif', 'Cotton', 55000, 77000, 1400),
('Haryana', 'Rohtak', '2012-13', 'Rabi', 'Wheat', 60000, 342000, 5700),

-- Karnataka 2012-13 data
('Karnataka', 'Bangalore', '2012-13', 'Kharif', 'Rice', 45000, 135000, 3000),
('Karnataka', 'Bangalore', '2012-13', 'Rabi', 'Maize', 35000, 105000, 3000),
('Karnataka', 'Mysore', '2012-13', 'Kharif', 'Rice', 55000, 192500, 3500),
('Karnataka', 'Mysore', '2012-13', 'Whole Year', 'Sugarcane', 25000, 1875000, 75000),
('Karnataka', 'Belgaum', '2012-13', 'Kharif', 'Jowar', 85000, 127500, 1500),
('Karnataka', 'Belgaum', '2012-13', 'Kharif', 'Cotton', 75000, 112500, 1500),
('Karnataka', 'Mandya', '2012-13', 'Kharif', 'Rice', 60000, 240000, 4000),
('Karnataka', 'Mandya', '2012-13', 'Whole Year', 'Sugarcane', 40000, 3200000, 80000),
('Karnataka', 'Tumkur', '2012-13', 'Kharif', 'Groundnut', 70000, 98000, 1400),
('Karnataka', 'Tumkur', '2012-13', 'Rabi', 'Maize', 45000, 135000, 3000),

-- Maharashtra 2012-13 data
('Maharashtra', 'Nagpur', '2012-13', 'Kharif', 'Cotton', 120000, 180000, 1500),
('Maharashtra', 'Nagpur', '2012-13', 'Kharif', 'Soyabean', 95000, 114000, 1200),
('Maharashtra', 'Pune', '2012-13', 'Kharif', 'Rice', 65000, 195000, 3000),
('Maharashtra', 'Pune', '2012-13', 'Whole Year', 'Sugarcane', 55000, 4125000, 75000),
('Maharashtra', 'Nashik', '2012-13', 'Kharif', 'Cotton', 85000, 127500, 1500),
('Maharashtra', 'Nashik', '2012-13', 'Kharif', 'Jowar', 75000, 112500, 1500),
('Maharashtra', 'Ahmednagar', '2012-13', 'Kharif', 'Cotton', 110000, 165000, 1500),
('Maharashtra', 'Ahmednagar', '2012-13', 'Whole Year', 'Sugarcane', 45000, 3375000, 75000),
('Maharashtra', 'Solapur', '2012-13', 'Kharif', 'Cotton', 95000, 133000, 1400),
('Maharashtra', 'Solapur', '2012-13', 'Kharif', 'Jowar', 80000, 112000, 1400),

-- Tamil Nadu 2012-13 data
('Tamil Nadu', 'Coimbatore', '2012-13', 'Kharif', 'Rice', 55000, 192500, 3500),
('Tamil Nadu', 'Coimbatore', '2012-13', 'Kharif', 'Cotton', 45000, 63000, 1400),
('Tamil Nadu', 'Thanjavur', '2012-13', 'Kharif', 'Rice', 85000, 340000, 4000),
('Tamil Nadu', 'Thanjavur', '2012-13', 'Rabi', 'Rice', 80000, 320000, 4000),
('Tamil Nadu', 'Erode', '2012-13', 'Kharif', 'Cotton', 65000, 91000, 1400),
('Tamil Nadu', 'Erode', '2012-13', 'Whole Year', 'Sugarcane', 35000, 2625000, 75000),
('Tamil Nadu', 'Madurai', '2012-13', 'Kharif', 'Cotton', 55000, 77000, 1400),
('Tamil Nadu', 'Madurai', '2012-13', 'Kharif', 'Groundnut', 45000, 63000, 1400),
('Tamil Nadu', 'Salem', '2012-13', 'Kharif', 'Rice', 60000, 210000, 3500),
('Tamil Nadu', 'Salem', '2012-13', 'Kharif', 'Groundnut', 50000, 70000, 1400),

-- Uttar Pradesh 2012-13 data
('Uttar Pradesh', 'Meerut', '2012-13', 'Kharif', 'Rice', 95000, 380000, 4000),
('Uttar Pradesh', 'Meerut', '2012-13', 'Rabi', 'Wheat', 105000, 609000, 5800),
('Uttar Pradesh', 'Agra', '2012-13', 'Kharif', 'Rice', 75000, 262500, 3500),
('Uttar Pradesh', 'Agra', '2012-13', 'Rabi', 'Wheat', 85000, 493000, 5800),
('Uttar Pradesh', 'Lucknow', '2012-13', 'Kharif', 'Rice', 65000, 260000, 4000),
('Uttar Pradesh', 'Lucknow', '2012-13', 'Rabi', 'Wheat', 75000, 435000, 5800),
('Uttar Pradesh', 'Varanasi', '2012-13', 'Kharif', 'Rice', 80000, 320000, 4000),
('Uttar Pradesh', 'Varanasi', '2012-13', 'Rabi', 'Wheat', 85000, 493000, 5800),
('Uttar Pradesh', 'Gorakhpur', '2012-13', 'Kharif', 'Rice', 90000, 360000, 4000),
('Uttar Pradesh', 'Gorakhpur', '2012-13', 'Whole Year', 'Sugarcane', 55000, 4125000, 75000),

-- Additional data for 2011-12 (Maharashtra)
('Maharashtra', 'Nagpur', '2011-12', 'Kharif', 'Cotton', 115000, 161000, 1400),
('Maharashtra', 'Nagpur', '2011-12', 'Kharif', 'Soyabean', 90000, 108000, 1200),
('Maharashtra', 'Pune', '2011-12', 'Kharif', 'Rice', 60000, 180000, 3000),
('Maharashtra', 'Pune', '2011-12', 'Whole Year', 'Sugarcane', 50000, 3500000, 70000),
('Maharashtra', 'Nashik', '2011-12', 'Kharif', 'Cotton', 80000, 112000, 1400),
('Maharashtra', 'Nashik', '2011-12', 'Kharif', 'Jowar', 70000, 105000, 1500),

-- Additional data for 2010-11 (Karnataka)
('Karnataka', 'Bangalore', '2010-11', 'Kharif', 'Rice', 42000, 119000, 2833),
('Karnataka', 'Bangalore', '2010-11', 'Rabi', 'Maize', 33000, 99000, 3000),
('Karnataka', 'Mysore', '2010-11', 'Kharif', 'Rice', 52000, 182000, 3500),
('Karnataka', 'Mysore', '2010-11', 'Whole Year', 'Sugarcane', 23000, 1610000, 70000),
('Karnataka', 'Belgaum', '2010-11', 'Kharif', 'Jowar', 80000, 112000, 1400),
('Karnataka', 'Belgaum', '2010-11', 'Kharif', 'Cotton', 70000, 98000, 1400),

-- Additional data for 2010-11 (Punjab)
('Punjab', 'Amritsar', '2010-11', 'Kharif', 'Rice', 115000, 552000, 4800),
('Punjab', 'Amritsar', '2010-11', 'Rabi', 'Wheat', 125000, 725000, 5800),
('Punjab', 'Ludhiana', '2010-11', 'Kharif', 'Rice', 140000, 700000, 5000),
('Punjab', 'Ludhiana', '2010-11', 'Rabi', 'Wheat', 150000, 930000, 6200),

-- Additional data for 2009-10 (Tamil Nadu)
('Tamil Nadu', 'Coimbatore', '2009-10', 'Kharif', 'Rice', 52000, 182000, 3500),
('Tamil Nadu', 'Coimbatore', '2009-10', 'Kharif', 'Cotton', 42000, 58800, 1400),
('Tamil Nadu', 'Thanjavur', '2009-10', 'Kharif', 'Rice', 82000, 312800, 3815),
('Tamil Nadu', 'Thanjavur', '2009-10', 'Rabi', 'Rice', 78000, 304200, 3900);
