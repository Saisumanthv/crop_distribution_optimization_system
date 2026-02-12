import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RecommendationEngineProps {
  onGenerateComplete: () => void;
}

export default function RecommendationEngine({ onGenerateComplete }: RecommendationEngineProps) {
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');
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

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      const { data: statesData, error: statesError } = await supabase.rpc('get_distinct_states');

      if (statesError) {
        const { data: fallbackStates } = await supabase
          .from('crop_production_data')
          .select('state_name')
          .limit(5000);

        if (fallbackStates) {
          const uniqueStates = [...new Set(fallbackStates.map(d => d.state_name))].sort();
          setStates(uniqueStates);
        }
      } else if (statesData) {
        setStates(statesData.map((d: any) => d.state_name));
      }
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedState) {
      setError('Please select a state');
      return;
    }
    if (!cropYear) {
      setError('Please select a crop year');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-recommendations`;
      let url = `${apiUrl}?state_name=${encodeURIComponent(selectedState)}&crop_year=${encodeURIComponent(cropYear)}`;

      if (specificCrop) {
        url += `&crop=${encodeURIComponent(specificCrop)}`;
      }

      const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (openaiKey && openaiKey.trim()) {
        url += `&openai_key=${encodeURIComponent(openaiKey)}`;
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
        const aiNote = data.ai_powered ? ' with AI-enhanced recommendations' : '';
        setMessage(
          `Generated ${data.strategies_count} crop growing strategies for ${selectedState} in ${cropYear}${predictionNote}${aiNote}`
        );
        setTimeout(() => {
          onGenerateComplete();
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate strategies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-emerald-600" />
        <h2 className="text-xl font-semibold text-gray-800">Generate Crop Growing Strategies</h2>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select State *
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">Choose a state...</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Year *
          </label>
          <select
            value={cropYear}
            onChange={(e) => setCropYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to analyze all crops
          </p>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !selectedState || !cropYear}
        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing Growing Strategies...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Crop Strategies
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
    </div>
  );
}
