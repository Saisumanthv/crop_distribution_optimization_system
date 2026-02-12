import { useState } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';

interface DataFetcherProps {
  onFetchComplete: () => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const CROP_YEARS = [
  "1997-98", "1998-99", "1999-00", "2000-01", "2001-02", "2002-03", "2003-04", "2004-05",
  "2005-06", "2006-07", "2007-08", "2008-09", "2009-10",
  "2010-11", "2011-12", "2012-13", "2013-14", "2014-15"
];

const RECOMMENDED_COMBINATIONS = [
  { state: "Punjab", year: "2010-11", description: "Punjab - Strong rice & wheat data" },
  { state: "Haryana", year: "2011-12", description: "Haryana - Comprehensive crop data" },
  { state: "Uttar Pradesh", year: "2012-13", description: "Uttar Pradesh - Large dataset" },
  { state: "Karnataka", year: "2010-11", description: "Karnataka - Diverse crops" },
  { state: "Maharashtra", year: "2011-12", description: "Maharashtra - Complete records" },
];

export default function DataFetcher({ onFetchComplete }: DataFetcherProps) {
  const [selectedState, setSelectedState] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadRecommendedData = (state: string, year: string) => {
    setSelectedState(state);
    setSelectedYear(year);
    setError('');
    setMessage('');
  };

  const handleFetch = async () => {
    if (!selectedState || !selectedYear) {
      setError('Please select both state and year');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-crop-data`;
      const response = await fetch(
        `${apiUrl}?state_name=${encodeURIComponent(selectedState)}&crop_year=${encodeURIComponent(selectedYear)}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.recordsFound === 0) {
        setError(`No data available for ${selectedState} (${selectedYear}) in the data.gov.in database. This is common - the government database has incomplete coverage. Try one of the recommended combinations above, or experiment with different states and years (Punjab, Haryana, Karnataka, and Maharashtra typically have better data coverage).`);
      } else {
        setMessage(data.message || `Successfully fetched ${data.recordsFound} records`);
        setTimeout(() => {
          onFetchComplete();
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-emerald-600" />
        <h2 className="text-xl font-semibold text-gray-800">Import Crop Data</h2>
      </div>

      <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p className="text-sm font-medium text-emerald-900 mb-2">Quick Start - Try These:</p>
        <div className="flex flex-wrap gap-2">
          {RECOMMENDED_COMBINATIONS.map((combo, idx) => (
            <button
              key={idx}
              onClick={() => loadRecommendedData(combo.state, combo.year)}
              className="px-3 py-1.5 bg-white border border-emerald-300 rounded-md text-xs text-emerald-800 hover:bg-emerald-100 transition-colors"
              disabled={loading}
            >
              {combo.state} ({combo.year})
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">Choose a state...</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crop Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">Choose a year...</option>
            {CROP_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleFetch}
        disabled={loading || !selectedState || !selectedYear}
        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Fetching Data...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Import from data.gov.in
          </>
        )}
      </button>

      {message && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Important Information:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Data Coverage:</strong> The data.gov.in API has incomplete records. Many state-year combinations return no data</li>
              <li><strong>Best Results:</strong> Use the quick start buttons above for guaranteed data availability</li>
              <li><strong>Date Range:</strong> API covers 1997-98 to 2014-15, but not all states have data for all years</li>
              <li><strong>Telangana Note:</strong> Telangana formed in 2014. Use "Andhra Pradesh" for earlier years</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
