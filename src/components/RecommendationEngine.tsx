import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface RecommendationEngineProps {
  onGenerateComplete: () => void;
}

export default function RecommendationEngine({ onGenerateComplete }: RecommendationEngineProps) {
  const [cropYear, setCropYear] = useState('');
  const [specificCrop, setSpecificCrop] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const FUTURE_YEARS = [
    "2015-16", "2016-17", "2017-18", "2018-19", "2019-20",
    "2020-21", "2021-22", "2022-23", "2023-24", "2024-25",
    "2025-26", "2026-27", "2027-28", "2028-29", "2029-30"
  ];

  const handleGenerate = async () => {
    if (!cropYear) {
      setError('Please select a crop year');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-recommendations`;
      let url = `${apiUrl}?crop_year=${encodeURIComponent(cropYear)}`;

      if (specificCrop) {
        url += `&crop=${encodeURIComponent(specificCrop)}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        const predictionNote = data.is_prediction ? ' (using predictive analytics)' : '';
        setMessage(
          `Generated ${data.recommendations_count} optimal transaction recommendations for ${cropYear}${predictionNote}`
        );
        setTimeout(() => {
          onGenerateComplete();
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Generate Recommendations</h2>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Year *
          </label>
          <select
            value={cropYear}
            onChange={(e) => setCropYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">Select year for analysis...</option>
            {FUTURE_YEARS.map((year) => (
              <option key={year} value={year}>
                {year} {parseInt(year.split('-')[0]) > 2015 ? '(Predicted)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specific Crop (Optional)
          </label>
          <input
            type="text"
            value={specificCrop}
            onChange={(e) => setSpecificCrop(e.target.value)}
            placeholder="e.g., Rice, Wheat, Cotton..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to analyze all crops
          </p>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !cropYear}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing & Optimizing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Optimal Recommendations
          </>
        )}
      </button>

      {message && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Years after 2015 use machine learning to predict production based on historical trends.
        </p>
      </div>
    </div>
  );
}
