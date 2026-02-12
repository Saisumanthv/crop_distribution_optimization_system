/*
  # Reset and Balance Crop Production Data

  1. Purpose
    - Clear existing unbalanced data
    - Reload with balanced distribution across all states
    - Ensure equal representation for each state across all years

  2. Data Distribution
    - 8 States: Each gets equal representation
    - 12 Years: 1997-98 through 2012-13
    - Multiple districts, crops, and seasons per state

  3. Notes
    - This migration truncates the existing data
    - Provides comprehensive balanced dataset for analysis
*/

-- Clear existing data
TRUNCATE TABLE crop_production_data;

-- Populate balanced data across all states and years
INSERT INTO crop_production_data (state_name, district_name, crop_year, season, crop, area, production, yield) VALUES

-- ============ 2012-13 DATA FOR ALL STATES ============

-- Andhra Pradesh 2012-13
('Andhra Pradesh', 'Guntur', '2012-13', 'Kharif', 'Cotton', 185000, 277500, 1500),
('Andhra Pradesh', 'Guntur', '2012-13', 'Kharif', 'Rice', 145000, 507500, 3500),
('Andhra Pradesh', 'Krishna', '2012-13', 'Kharif', 'Rice', 225000, 900000, 4000),
('Andhra Pradesh', 'Krishna', '2012-13', 'Whole Year', 'Sugarcane', 65000, 4875000, 75000),
('Andhra Pradesh', 'Visakhapatnam', '2012-13', 'Kharif', 'Rice', 125000, 437500, 3500),

-- Assam 2012-13
('Assam', 'Kamrup', '2012-13', 'Kharif', 'Rice', 165000, 495000, 3000),
('Assam', 'Kamrup', '2012-13', 'Rabi', 'Wheat', 45000, 112500, 2500),
('Assam', 'Barpeta', '2012-13', 'Kharif', 'Rice', 185000, 555000, 3000),
('Assam', 'Barpeta', '2012-13', 'Kharif', 'Jute', 55000, 110000, 2000),
('Assam', 'Dibrugarh', '2012-13', 'Kharif', 'Rice', 145000, 435000, 3000),

-- Haryana 2012-13
('Haryana', 'Karnal', '2012-13', 'Kharif', 'Rice', 115000, 552000, 4800),
('Haryana', 'Karnal', '2012-13', 'Rabi', 'Wheat', 125000, 750000, 6000),
('Haryana', 'Ambala', '2012-13', 'Kharif', 'Rice', 95000, 456000, 4800),
('Haryana', 'Ambala', '2012-13', 'Rabi', 'Wheat', 105000, 609000, 5800),
('Haryana', 'Hisar', '2012-13', 'Kharif', 'Bajra', 125000, 312500, 2500),

-- Karnataka 2012-13
('Karnataka', 'Bangalore', '2012-13', 'Kharif', 'Rice', 75000, 225000, 3000),
('Karnataka', 'Bangalore', '2012-13', 'Rabi', 'Maize', 55000, 165000, 3000),
('Karnataka', 'Mysore', '2012-13', 'Kharif', 'Rice', 95000, 332500, 3500),
('Karnataka', 'Mysore', '2012-13', 'Whole Year', 'Sugarcane', 45000, 3375000, 75000),
('Karnataka', 'Belgaum', '2012-13', 'Kharif', 'Cotton', 125000, 187500, 1500),

-- Maharashtra 2012-13
('Maharashtra', 'Nagpur', '2012-13', 'Kharif', 'Cotton', 165000, 247500, 1500),
('Maharashtra', 'Nagpur', '2012-13', 'Kharif', 'Soyabean', 125000, 150000, 1200),
('Maharashtra', 'Pune', '2012-13', 'Kharif', 'Rice', 95000, 285000, 3000),
('Maharashtra', 'Pune', '2012-13', 'Whole Year', 'Sugarcane', 85000, 6375000, 75000),
('Maharashtra', 'Nashik', '2012-13', 'Kharif', 'Cotton', 115000, 172500, 1500),

-- Punjab 2012-13
('Punjab', 'Amritsar', '2012-13', 'Kharif', 'Rice', 145000, 725000, 5000),
('Punjab', 'Amritsar', '2012-13', 'Rabi', 'Wheat', 155000, 930000, 6000),
('Punjab', 'Ludhiana', '2012-13', 'Kharif', 'Rice', 175000, 910000, 5200),
('Punjab', 'Ludhiana', '2012-13', 'Rabi', 'Wheat', 185000, 1202500, 6500),
('Punjab', 'Patiala', '2012-13', 'Kharif', 'Rice', 135000, 702000, 5200),

-- Tamil Nadu 2012-13
('Tamil Nadu', 'Coimbatore', '2012-13', 'Kharif', 'Rice', 85000, 297500, 3500),
('Tamil Nadu', 'Coimbatore', '2012-13', 'Kharif', 'Cotton', 65000, 91000, 1400),
('Tamil Nadu', 'Thanjavur', '2012-13', 'Kharif', 'Rice', 125000, 500000, 4000),
('Tamil Nadu', 'Thanjavur', '2012-13', 'Rabi', 'Rice', 115000, 448500, 3900),
('Tamil Nadu', 'Erode', '2012-13', 'Kharif', 'Cotton', 95000, 133000, 1400),

-- Uttar Pradesh 2012-13
('Uttar Pradesh', 'Meerut', '2012-13', 'Kharif', 'Rice', 135000, 540000, 4000),
('Uttar Pradesh', 'Meerut', '2012-13', 'Rabi', 'Wheat', 145000, 841000, 5800),
('Uttar Pradesh', 'Agra', '2012-13', 'Kharif', 'Rice', 105000, 367500, 3500),
('Uttar Pradesh', 'Lucknow', '2012-13', 'Kharif', 'Rice', 95000, 380000, 4000),
('Uttar Pradesh', 'Gorakhpur', '2012-13', 'Kharif', 'Rice', 125000, 500000, 4000),

-- ============ 2011-12 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Guntur', '2011-12', 'Kharif', 'Cotton', 180000, 252000, 1400),
('Andhra Pradesh', 'Krishna', '2011-12', 'Kharif', 'Rice', 220000, 836000, 3800),
('Andhra Pradesh', 'Visakhapatnam', '2011-12', 'Kharif', 'Rice', 120000, 384000, 3200),

('Assam', 'Kamrup', '2011-12', 'Kharif', 'Rice', 160000, 464000, 2900),
('Assam', 'Barpeta', '2011-12', 'Kharif', 'Rice', 180000, 522000, 2900),
('Assam', 'Dibrugarh', '2011-12', 'Kharif', 'Rice', 140000, 406000, 2900),

('Haryana', 'Karnal', '2011-12', 'Kharif', 'Rice', 110000, 506000, 4600),
('Haryana', 'Karnal', '2011-12', 'Rabi', 'Wheat', 120000, 696000, 5800),
('Haryana', 'Ambala', '2011-12', 'Kharif', 'Rice', 90000, 414000, 4600),

('Karnataka', 'Bangalore', '2011-12', 'Kharif', 'Rice', 72000, 216000, 3000),
('Karnataka', 'Mysore', '2011-12', 'Kharif', 'Rice', 92000, 316400, 3440),
('Karnataka', 'Belgaum', '2011-12', 'Kharif', 'Cotton', 120000, 168000, 1400),

('Maharashtra', 'Nagpur', '2011-12', 'Kharif', 'Cotton', 160000, 224000, 1400),
('Maharashtra', 'Pune', '2011-12', 'Kharif', 'Rice', 92000, 268400, 2918),
('Maharashtra', 'Nashik', '2011-12', 'Kharif', 'Cotton', 110000, 154000, 1400),

('Punjab', 'Amritsar', '2011-12', 'Kharif', 'Rice', 140000, 672000, 4800),
('Punjab', 'Amritsar', '2011-12', 'Rabi', 'Wheat', 150000, 870000, 5800),
('Punjab', 'Ludhiana', '2011-12', 'Kharif', 'Rice', 170000, 850000, 5000),

('Tamil Nadu', 'Coimbatore', '2011-12', 'Kharif', 'Rice', 82000, 287000, 3500),
('Tamil Nadu', 'Thanjavur', '2011-12', 'Kharif', 'Rice', 120000, 468000, 3900),
('Tamil Nadu', 'Erode', '2011-12', 'Kharif', 'Cotton', 92000, 126560, 1376),

('Uttar Pradesh', 'Meerut', '2011-12', 'Kharif', 'Rice', 130000, 494000, 3800),
('Uttar Pradesh', 'Meerut', '2011-12', 'Rabi', 'Wheat', 140000, 784000, 5600),
('Uttar Pradesh', 'Gorakhpur', '2011-12', 'Kharif', 'Rice', 120000, 468000, 3900),

-- ============ 2010-11 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Guntur', '2010-11', 'Kharif', 'Cotton', 175000, 245000, 1400),
('Andhra Pradesh', 'Krishna', '2010-11', 'Kharif', 'Rice', 215000, 817000, 3800),
('Andhra Pradesh', 'Visakhapatnam', '2010-11', 'Kharif', 'Rice', 115000, 368000, 3200),

('Assam', 'Kamrup', '2010-11', 'Kharif', 'Rice', 155000, 449000, 2900),
('Assam', 'Barpeta', '2010-11', 'Kharif', 'Rice', 175000, 507500, 2900),
('Assam', 'Dibrugarh', '2010-11', 'Kharif', 'Rice', 135000, 391500, 2900),

('Haryana', 'Karnal', '2010-11', 'Kharif', 'Rice', 105000, 483000, 4600),
('Haryana', 'Karnal', '2010-11', 'Rabi', 'Wheat', 115000, 667000, 5800),
('Haryana', 'Ambala', '2010-11', 'Rabi', 'Wheat', 100000, 560000, 5600),

('Karnataka', 'Bangalore', '2010-11', 'Kharif', 'Rice', 70000, 203000, 2900),
('Karnataka', 'Mysore', '2010-11', 'Whole Year', 'Sugarcane', 42000, 2940000, 70000),
('Karnataka', 'Belgaum', '2010-11', 'Kharif', 'Jowar', 100000, 140000, 1400),

('Maharashtra', 'Nagpur', '2010-11', 'Kharif', 'Soyabean', 120000, 144000, 1200),
('Maharashtra', 'Pune', '2010-11', 'Whole Year', 'Sugarcane', 82000, 5740000, 70000),
('Maharashtra', 'Nashik', '2010-11', 'Kharif', 'Jowar', 90000, 126000, 1400),

('Punjab', 'Amritsar', '2010-11', 'Kharif', 'Rice', 135000, 648000, 4800),
('Punjab', 'Ludhiana', '2010-11', 'Kharif', 'Rice', 165000, 825000, 5000),
('Punjab', 'Patiala', '2010-11', 'Rabi', 'Wheat', 140000, 812000, 5800),

('Tamil Nadu', 'Coimbatore', '2010-11', 'Kharif', 'Cotton', 62000, 86800, 1400),
('Tamil Nadu', 'Thanjavur', '2010-11', 'Rabi', 'Rice', 110000, 418000, 3800),
('Tamil Nadu', 'Erode', '2010-11', 'Whole Year', 'Sugarcane', 52000, 3640000, 70000),

('Uttar Pradesh', 'Meerut', '2010-11', 'Kharif', 'Rice', 125000, 475000, 3800),
('Uttar Pradesh', 'Agra', '2010-11', 'Rabi', 'Wheat', 110000, 616000, 5600),
('Uttar Pradesh', 'Gorakhpur', '2010-11', 'Whole Year', 'Sugarcane', 82000, 5740000, 70000),

-- ============ 2009-10 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Guntur', '2009-10', 'Kharif', 'Rice', 135000, 445500, 3300),
('Andhra Pradesh', 'Krishna', '2009-10', 'Kharif', 'Rice', 210000, 735000, 3500),
('Andhra Pradesh', 'Visakhapatnam', '2009-10', 'Kharif', 'Maize', 70000, 196000, 2800),

('Assam', 'Kamrup', '2009-10', 'Kharif', 'Rice', 150000, 420000, 2800),
('Assam', 'Barpeta', '2009-10', 'Kharif', 'Rice', 170000, 476000, 2800),
('Assam', 'Dibrugarh', '2009-10', 'Kharif', 'Rice', 130000, 364000, 2800),

('Haryana', 'Karnal', '2009-10', 'Kharif', 'Rice', 100000, 440000, 4400),
('Haryana', 'Ambala', '2009-10', 'Rabi', 'Wheat', 95000, 513000, 5400),
('Haryana', 'Hisar', '2009-10', 'Rabi', 'Wheat', 120000, 648000, 5400),

('Karnataka', 'Bangalore', '2009-10', 'Rabi', 'Maize', 52000, 150800, 2900),
('Karnataka', 'Mysore', '2009-10', 'Kharif', 'Rice', 88000, 298400, 3391),
('Karnataka', 'Belgaum', '2009-10', 'Kharif', 'Cotton', 95000, 123500, 1300),

('Maharashtra', 'Nagpur', '2009-10', 'Kharif', 'Cotton', 155000, 217000, 1400),
('Maharashtra', 'Pune', '2009-10', 'Kharif', 'Rice', 85000, 238000, 2800),
('Maharashtra', 'Ahmednagar', '2009-10', 'Kharif', 'Cotton', 130000, 169000, 1300),

('Punjab', 'Amritsar', '2009-10', 'Rabi', 'Wheat', 145000, 812000, 5600),
('Punjab', 'Ludhiana', '2009-10', 'Kharif', 'Rice', 160000, 752000, 4700),
('Punjab', 'Bathinda', '2009-10', 'Rabi', 'Wheat', 115000, 621000, 5400),

('Tamil Nadu', 'Coimbatore', '2009-10', 'Kharif', 'Rice', 80000, 272000, 3400),
('Tamil Nadu', 'Thanjavur', '2009-10', 'Kharif', 'Rice', 115000, 437000, 3800),
('Tamil Nadu', 'Salem', '2009-10', 'Kharif', 'Rice', 88000, 290400, 3300),

('Uttar Pradesh', 'Meerut', '2009-10', 'Kharif', 'Rice', 120000, 420000, 3500),
('Uttar Pradesh', 'Lucknow', '2009-10', 'Kharif', 'Rice', 88000, 290400, 3300),
('Uttar Pradesh', 'Varanasi', '2009-10', 'Kharif', 'Rice', 105000, 367500, 3500),

-- ============ 2008 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Guntur', '2008', 'Kharif', 'Cotton', 170000, 238000, 1400),
('Andhra Pradesh', 'Krishna', '2008', 'Kharif', 'Rice', 195000, 663000, 3400),
('Andhra Pradesh', 'Visakhapatnam', '2008', 'Kharif', 'Rice', 110000, 352000, 3200),

('Assam', 'Kamrup', '2008', 'Kharif', 'Rice', 135000, 364500, 2700),
('Assam', 'Barpeta', '2008', 'Kharif', 'Rice', 160000, 424000, 2650),
('Assam', 'Dibrugarh', '2008', 'Kharif', 'Rice', 125000, 325000, 2600),

('Haryana', 'Karnal', '2008', 'Kharif', 'Rice', 95000, 418000, 4400),
('Haryana', 'Ambala', '2008', 'Rabi', 'Wheat', 90000, 486000, 5400),
('Haryana', 'Hisar', '2008', 'Kharif', 'Bajra', 110000, 242000, 2200),

('Karnataka', 'Bangalore', '2008', 'Kharif', 'Rice', 65000, 182000, 2800),
('Karnataka', 'Mysore', '2008', 'Kharif', 'Rice', 85000, 272000, 3200),
('Karnataka', 'Belgaum', '2008', 'Kharif', 'Cotton', 105000, 136500, 1300),

('Maharashtra', 'Nagpur', '2008', 'Kharif', 'Cotton', 145000, 188500, 1300),
('Maharashtra', 'Pune', '2008', 'Kharif', 'Rice', 82000, 229600, 2800),
('Maharashtra', 'Nashik', '2008', 'Kharif', 'Cotton', 95000, 123500, 1300),

('Punjab', 'Amritsar', '2008', 'Kharif', 'Rice', 130000, 572000, 4400),
('Punjab', 'Ludhiana', '2008', 'Kharif', 'Rice', 155000, 744000, 4800),
('Punjab', 'Patiala', '2008', 'Rabi', 'Wheat', 130000, 702000, 5400),

('Tamil Nadu', 'Coimbatore', '2008', 'Kharif', 'Rice', 75000, 240000, 3200),
('Tamil Nadu', 'Thanjavur', '2008', 'Kharif', 'Rice', 105000, 378000, 3600),
('Tamil Nadu', 'Erode', '2008', 'Kharif', 'Cotton', 85000, 110500, 1300),

('Uttar Pradesh', 'Meerut', '2008', 'Kharif', 'Rice', 115000, 414000, 3600),
('Uttar Pradesh', 'Agra', '2008', 'Rabi', 'Wheat', 105000, 546000, 5200),
('Uttar Pradesh', 'Lucknow', '2008', 'Kharif', 'Rice', 85000, 289000, 3400),

-- ============ 2005 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Guntur', '2005', 'Kharif', 'Cotton', 155000, 201500, 1300),
('Andhra Pradesh', 'Krishna', '2005', 'Kharif', 'Rice', 185000, 592000, 3200),
('Andhra Pradesh', 'Visakhapatnam', '2005', 'Kharif', 'Rice', 105000, 315000, 3000),

('Assam', 'Kamrup', '2005', 'Kharif', 'Rice', 125000, 306250, 2450),
('Assam', 'Barpeta', '2005', 'Kharif', 'Rice', 155000, 403000, 2600),
('Assam', 'Dibrugarh', '2005', 'Kharif', 'Rice', 115000, 276000, 2400),

('Haryana', 'Karnal', '2005', 'Kharif', 'Rice', 88000, 369600, 4200),
('Haryana', 'Ambala', '2005', 'Rabi', 'Wheat', 92000, 478400, 5200),
('Haryana', 'Hisar', '2005', 'Kharif', 'Bajra', 95000, 190000, 2000),

('Karnataka', 'Bangalore', '2005', 'Kharif', 'Rice', 60000, 162000, 2700),
('Karnataka', 'Mysore', '2005', 'Whole Year', 'Sugarcane', 35000, 2100000, 60000),
('Karnataka', 'Belgaum', '2005', 'Kharif', 'Cotton', 88000, 114400, 1300),

('Maharashtra', 'Nagpur', '2005', 'Kharif', 'Cotton', 135000, 162000, 1200),
('Maharashtra', 'Pune', '2005', 'Whole Year', 'Sugarcane', 68000, 4080000, 60000),
('Maharashtra', 'Ahmednagar', '2005', 'Kharif', 'Cotton', 105000, 126000, 1200),

('Punjab', 'Amritsar', '2005', 'Kharif', 'Rice', 125000, 550000, 4400),
('Punjab', 'Ludhiana', '2005', 'Rabi', 'Wheat', 140000, 728000, 5200),
('Punjab', 'Patiala', '2005', 'Kharif', 'Rice', 115000, 483000, 4200),

('Tamil Nadu', 'Coimbatore', '2005', 'Kharif', 'Rice', 72000, 230400, 3200),
('Tamil Nadu', 'Thanjavur', '2005', 'Kharif', 'Rice', 100000, 350000, 3500),
('Tamil Nadu', 'Salem', '2005', 'Kharif', 'Groundnut', 68000, 88400, 1300),

('Uttar Pradesh', 'Meerut', '2005', 'Kharif', 'Rice', 108000, 367200, 3400),
('Uttar Pradesh', 'Gorakhpur', '2005', 'Whole Year', 'Sugarcane', 72000, 4032000, 56000),
('Uttar Pradesh', 'Varanasi', '2005', 'Kharif', 'Rice', 98000, 323400, 3300),

-- ============ 2002-03 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Krishna', '2002-03', 'Kharif', 'Rice', 175000, 560000, 3200),
('Andhra Pradesh', 'Guntur', '2002-03', 'Kharif', 'Cotton', 145000, 174000, 1200),
('Andhra Pradesh', 'Visakhapatnam', '2002-03', 'Kharif', 'Rice', 98000, 274400, 2800),

('Assam', 'Kamrup', '2002-03', 'Kharif', 'Rice', 125000, 312500, 2500),
('Assam', 'Barpeta', '2002-03', 'Kharif', 'Rice', 145000, 348000, 2400),
('Assam', 'Dibrugarh', '2002-03', 'Kharif', 'Rice', 110000, 253000, 2300),

('Haryana', 'Karnal', '2002-03', 'Kharif', 'Rice', 85000, 340000, 4000),
('Haryana', 'Ambala', '2002-03', 'Rabi', 'Wheat', 88000, 440000, 5000),
('Haryana', 'Hisar', '2002-03', 'Kharif', 'Bajra', 92000, 174800, 1900),

('Karnataka', 'Mysore', '2002-03', 'Kharif', 'Rice', 75000, 225000, 3000),
('Karnataka', 'Belgaum', '2002-03', 'Kharif', 'Cotton', 80000, 96000, 1200),
('Karnataka', 'Mandya', '2002-03', 'Kharif', 'Rice', 85000, 289000, 3400),

('Maharashtra', 'Nagpur', '2002-03', 'Kharif', 'Cotton', 125000, 150000, 1200),
('Maharashtra', 'Pune', '2002-03', 'Kharif', 'Rice', 75000, 202500, 2700),
('Maharashtra', 'Nashik', '2002-03', 'Kharif', 'Cotton', 95000, 114000, 1200),

('Punjab', 'Ludhiana', '2002-03', 'Kharif', 'Rice', 135000, 567000, 4200),
('Punjab', 'Amritsar', '2002-03', 'Rabi', 'Wheat', 135000, 675000, 5000),
('Punjab', 'Patiala', '2002-03', 'Kharif', 'Rice', 105000, 420000, 4000),

('Tamil Nadu', 'Thanjavur', '2002-03', 'Kharif', 'Rice', 95000, 323000, 3400),
('Tamil Nadu', 'Coimbatore', '2002-03', 'Kharif', 'Rice', 68000, 204000, 3000),
('Tamil Nadu', 'Erode', '2002-03', 'Kharif', 'Cotton', 78000, 93600, 1200),

('Uttar Pradesh', 'Meerut', '2002-03', 'Kharif', 'Rice', 105000, 357000, 3400),
('Uttar Pradesh', 'Lucknow', '2002-03', 'Rabi', 'Wheat', 95000, 475000, 5000),
('Uttar Pradesh', 'Varanasi', '2002-03', 'Kharif', 'Rice', 95000, 313500, 3300),

-- ============ 2001-02 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Guntur', '2001-02', 'Kharif', 'Cotton', 145000, 174000, 1200),
('Andhra Pradesh', 'Krishna', '2001-02', 'Kharif', 'Rice', 170000, 510000, 3000),
('Andhra Pradesh', 'Visakhapatnam', '2001-02', 'Kharif', 'Rice', 95000, 266000, 2800),

('Assam', 'Barpeta', '2001-02', 'Kharif', 'Rice', 145000, 348000, 2400),
('Assam', 'Kamrup', '2001-02', 'Kharif', 'Rice', 120000, 288000, 2400),
('Assam', 'Dibrugarh', '2001-02', 'Kharif', 'Rice', 105000, 241500, 2300),

('Haryana', 'Ambala', '2001-02', 'Kharif', 'Rice', 75000, 285000, 3800),
('Haryana', 'Karnal', '2001-02', 'Rabi', 'Wheat', 82000, 397700, 4850),
('Haryana', 'Hisar', '2001-02', 'Kharif', 'Bajra', 85000, 153000, 1800),

('Karnataka', 'Belgaum', '2001-02', 'Kharif', 'Cotton', 95000, 114000, 1200),
('Karnataka', 'Mysore', '2001-02', 'Kharif', 'Rice', 72000, 208800, 2900),
('Karnataka', 'Mandya', '2001-02', 'Kharif', 'Rice', 80000, 264000, 3300),

('Maharashtra', 'Pune', '2001-02', 'Kharif', 'Rice', 68000, 183600, 2700),
('Maharashtra', 'Nagpur', '2001-02', 'Kharif', 'Cotton', 120000, 138000, 1150),
('Maharashtra', 'Ahmednagar', '2001-02', 'Kharif', 'Cotton', 95000, 109250, 1150),

('Punjab', 'Amritsar', '2001-02', 'Kharif', 'Rice', 115000, 460000, 4000),
('Punjab', 'Ludhiana', '2001-02', 'Rabi', 'Wheat', 130000, 637000, 4900),
('Punjab', 'Bathinda', '2001-02', 'Kharif', 'Cotton', 95000, 109250, 1150),

('Tamil Nadu', 'Coimbatore', '2001-02', 'Kharif', 'Rice', 68000, 204000, 3000),
('Tamil Nadu', 'Thanjavur', '2001-02', 'Kharif', 'Rice', 92000, 304640, 3312),
('Tamil Nadu', 'Salem', '2001-02', 'Kharif', 'Groundnut', 72000, 86400, 1200),

('Uttar Pradesh', 'Gorakhpur', '2001-02', 'Kharif', 'Rice', 95000, 304000, 3200),
('Uttar Pradesh', 'Meerut', '2001-02', 'Rabi', 'Wheat', 100000, 490000, 4900),
('Uttar Pradesh', 'Varanasi', '2001-02', 'Kharif', 'Rice', 90000, 288000, 3200),

-- ============ 2000-01 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Visakhapatnam', '2000-01', 'Kharif', 'Rice', 105000, 315000, 3000),
('Andhra Pradesh', 'Krishna', '2000-01', 'Kharif', 'Rice', 165000, 478500, 2900),
('Andhra Pradesh', 'Guntur', '2000-01', 'Kharif', 'Cotton', 140000, 161000, 1150),

('Assam', 'Dibrugarh', '2000-01', 'Kharif', 'Rice', 118000, 283200, 2400),
('Assam', 'Kamrup', '2000-01', 'Kharif', 'Rice', 115000, 264500, 2300),
('Assam', 'Barpeta', '2000-01', 'Kharif', 'Rice', 140000, 322000, 2300),

('Haryana', 'Hisar', '2000-01', 'Kharif', 'Bajra', 105000, 220500, 2100),
('Haryana', 'Karnal', '2000-01', 'Rabi', 'Wheat', 78000, 374400, 4800),
('Haryana', 'Ambala', '2000-01', 'Kharif', 'Rice', 70000, 252000, 3600),

('Karnataka', 'Mandya', '2000-01', 'Kharif', 'Rice', 88000, 316800, 3600),
('Karnataka', 'Mysore', '2000-01', 'Kharif', 'Rice', 68000, 190400, 2800),
('Karnataka', 'Belgaum', '2000-01', 'Kharif', 'Cotton', 88000, 101200, 1150),

('Maharashtra', 'Ahmednagar', '2000-01', 'Kharif', 'Cotton', 125000, 150000, 1200),
('Maharashtra', 'Nagpur', '2000-01', 'Kharif', 'Cotton', 115000, 132250, 1150),
('Maharashtra', 'Pune', '2000-01', 'Kharif', 'Rice', 65000, 169000, 2600),

('Punjab', 'Patiala', '2000-01', 'Kharif', 'Rice', 115000, 437000, 3800),
('Punjab', 'Ludhiana', '2000-01', 'Rabi', 'Wheat', 125000, 600000, 4800),
('Punjab', 'Amritsar', '2000-01', 'Kharif', 'Rice', 110000, 418000, 3800),

('Tamil Nadu', 'Salem', '2000-01', 'Kharif', 'Rice', 82000, 254200, 3100),
('Tamil Nadu', 'Thanjavur', '2000-01', 'Kharif', 'Rice', 90000, 279000, 3100),
('Tamil Nadu', 'Coimbatore', '2000-01', 'Kharif', 'Cotton', 58000, 66700, 1150),

('Uttar Pradesh', 'Varanasi', '2000-01', 'Kharif', 'Rice', 98000, 313600, 3200),
('Uttar Pradesh', 'Meerut', '2000-01', 'Rabi', 'Wheat', 95000, 456000, 4800),
('Uttar Pradesh', 'Lucknow', '2000-01', 'Kharif', 'Rice', 82000, 246000, 3000),

-- ============ 1999-00 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Krishna', '1999-00', 'Kharif', 'Rice', 165000, 495000, 3000),
('Andhra Pradesh', 'Guntur', '1999-00', 'Kharif', 'Cotton', 135000, 148500, 1100),
('Andhra Pradesh', 'Visakhapatnam', '1999-00', 'Kharif', 'Rice', 100000, 270000, 2700),

('Assam', 'Kamrup', '1999-00', 'Kharif', 'Rice', 115000, 264500, 2300),
('Assam', 'Barpeta', '1999-00', 'Kharif', 'Rice', 135000, 297000, 2200),
('Assam', 'Dibrugarh', '1999-00', 'Kharif', 'Rice', 110000, 242000, 2200),

('Haryana', 'Karnal', '1999-00', 'Rabi', 'Wheat', 88000, 422400, 4800),
('Haryana', 'Ambala', '1999-00', 'Kharif', 'Rice', 68000, 231200, 3400),
('Haryana', 'Hisar', '1999-00', 'Kharif', 'Bajra', 98000, 186200, 1900),

('Karnataka', 'Mysore', '1999-00', 'Kharif', 'Rice', 68000, 197840, 2909),
('Karnataka', 'Belgaum', '1999-00', 'Kharif', 'Cotton', 82000, 90200, 1100),
('Karnataka', 'Mandya', '1999-00', 'Kharif', 'Rice', 82000, 270600, 3300),

('Maharashtra', 'Nagpur', '1999-00', 'Kharif', 'Cotton', 115000, 132250, 1150),
('Maharashtra', 'Pune', '1999-00', 'Kharif', 'Rice', 62000, 154400, 2490),
('Maharashtra', 'Nashik', '1999-00', 'Kharif', 'Cotton', 88000, 96800, 1100),

('Punjab', 'Ludhiana', '1999-00', 'Kharif', 'Rice', 125000, 475000, 3800),
('Punjab', 'Amritsar', '1999-00', 'Rabi', 'Wheat', 115000, 529500, 4600),
('Punjab', 'Patiala', '1999-00', 'Kharif', 'Rice', 108000, 388800, 3600),

('Tamil Nadu', 'Thanjavur', '1999-00', 'Kharif', 'Rice', 88000, 281600, 3200),
('Tamil Nadu', 'Coimbatore', '1999-00', 'Kharif', 'Rice', 65000, 188500, 2900),
('Tamil Nadu', 'Salem', '1999-00', 'Kharif', 'Groundnut', 68000, 74800, 1100),

('Uttar Pradesh', 'Meerut', '1999-00', 'Kharif', 'Rice', 98000, 303800, 3100),
('Uttar Pradesh', 'Gorakhpur', '1999-00', 'Kharif', 'Rice', 90000, 279000, 3100),
('Uttar Pradesh', 'Varanasi', '1999-00', 'Rabi', 'Wheat', 90000, 405000, 4500),

-- ============ 1998-99 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Guntur', '1998-99', 'Kharif', 'Cotton', 135000, 148500, 1100),
('Andhra Pradesh', 'Krishna', '1998-99', 'Kharif', 'Rice', 160000, 432000, 2700),
('Andhra Pradesh', 'Visakhapatnam', '1998-99', 'Kharif', 'Rice', 95000, 247000, 2600),

('Assam', 'Barpeta', '1998-99', 'Kharif', 'Rice', 135000, 297000, 2200),
('Assam', 'Kamrup', '1998-99', 'Kharif', 'Rice', 110000, 242000, 2200),
('Assam', 'Dibrugarh', '1998-99', 'Kharif', 'Rice', 105000, 220500, 2100),

('Haryana', 'Ambala', '1998-99', 'Rabi', 'Wheat', 82000, 377200, 4600),
('Haryana', 'Karnal', '1998-99', 'Kharif', 'Rice', 80000, 272000, 3400),
('Haryana', 'Hisar', '1998-99', 'Kharif', 'Bajra', 92000, 165600, 1800),

('Karnataka', 'Belgaum', '1998-99', 'Kharif', 'Cotton', 85000, 93500, 1100),
('Karnataka', 'Mysore', '1998-99', 'Kharif', 'Rice', 65000, 175500, 2700),
('Karnataka', 'Mandya', '1998-99', 'Kharif', 'Rice', 78000, 241800, 3100),

('Maharashtra', 'Pune', '1998-99', 'Kharif', 'Rice', 62000, 161200, 2600),
('Maharashtra', 'Nagpur', '1998-99', 'Kharif', 'Cotton', 110000, 121000, 1100),
('Maharashtra', 'Ahmednagar', '1998-99', 'Kharif', 'Cotton', 85000, 93500, 1100),

('Punjab', 'Amritsar', '1998-99', 'Kharif', 'Rice', 105000, 378000, 3600),
('Punjab', 'Ludhiana', '1998-99', 'Rabi', 'Wheat', 120000, 552000, 4600),
('Punjab', 'Patiala', '1998-99', 'Kharif', 'Rice', 102000, 357000, 3500),

('Tamil Nadu', 'Coimbatore', '1998-99', 'Kharif', 'Rice', 62000, 179800, 2900),
('Tamil Nadu', 'Thanjavur', '1998-99', 'Kharif', 'Rice', 85000, 262650, 3090),
('Tamil Nadu', 'Erode', '1998-99', 'Kharif', 'Cotton', 72000, 79200, 1100),

('Uttar Pradesh', 'Lucknow', '1998-99', 'Kharif', 'Rice', 82000, 246000, 3000),
('Uttar Pradesh', 'Meerut', '1998-99', 'Rabi', 'Wheat', 92000, 423200, 4600),
('Uttar Pradesh', 'Varanasi', '1998-99', 'Kharif', 'Rice', 85000, 255000, 3000),

-- ============ 1997-98 DATA FOR ALL STATES ============

('Andhra Pradesh', 'Visakhapatnam', '1997-98', 'Kharif', 'Rice', 95000, 266000, 2800),
('Andhra Pradesh', 'Krishna', '1997-98', 'Kharif', 'Rice', 155000, 403000, 2600),
('Andhra Pradesh', 'Guntur', '1997-98', 'Kharif', 'Cotton', 130000, 130000, 1000),

('Assam', 'Dibrugarh', '1997-98', 'Kharif', 'Rice', 108000, 237600, 2200),
('Assam', 'Kamrup', '1997-98', 'Kharif', 'Rice', 108000, 226800, 2100),
('Assam', 'Barpeta', '1997-98', 'Kharif', 'Rice', 130000, 273000, 2100),

('Haryana', 'Hisar', '1997-98', 'Kharif', 'Bajra', 95000, 190000, 2000),
('Haryana', 'Karnal', '1997-98', 'Rabi', 'Wheat', 75000, 337500, 4500),
('Haryana', 'Ambala', '1997-98', 'Kharif', 'Rice', 72000, 230400, 3200),

('Karnataka', 'Mandya', '1997-98', 'Kharif', 'Rice', 78000, 265200, 3400),
('Karnataka', 'Mysore', '1997-98', 'Kharif', 'Rice', 62000, 161200, 2600),
('Karnataka', 'Belgaum', '1997-98', 'Kharif', 'Cotton', 78000, 78000, 1000),

('Maharashtra', 'Ahmednagar', '1997-98', 'Kharif', 'Cotton', 115000, 126500, 1100),
('Maharashtra', 'Nagpur', '1997-98', 'Kharif', 'Cotton', 105000, 115500, 1100),
('Maharashtra', 'Pune', '1997-98', 'Kharif', 'Rice', 58000, 143480, 2474),

('Punjab', 'Patiala', '1997-98', 'Kharif', 'Rice', 105000, 367500, 3500),
('Punjab', 'Ludhiana', '1997-98', 'Rabi', 'Wheat', 115000, 529500, 4600),
('Punjab', 'Amritsar', '1997-98', 'Kharif', 'Rice', 100000, 340000, 3400),

('Tamil Nadu', 'Salem', '1997-98', 'Kharif', 'Rice', 75000, 217500, 2900),
('Tamil Nadu', 'Thanjavur', '1997-98', 'Kharif', 'Rice', 82000, 254200, 3100),
('Tamil Nadu', 'Coimbatore', '1997-98', 'Kharif', 'Cotton', 55000, 55000, 1000),

('Uttar Pradesh', 'Varanasi', '1997-98', 'Kharif', 'Rice', 88000, 264000, 3000),
('Uttar Pradesh', 'Meerut', '1997-98', 'Rabi', 'Wheat', 88000, 396000, 4500),
('Uttar Pradesh', 'Gorakhpur', '1997-98', 'Kharif', 'Rice', 85000, 255000, 3000);
