import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MapPin, Leaf, DollarSign, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TradeRecommendation {
  crop: string;
  partner_state: string;
  distance_km: number;
  quantity: number;
  reason: string;
  environmental_benefit: string;
  cost_benefit: string;
}

interface TradeAnalysis {
  state_name: string;
  crop_year: string;
  analysis_date: string;
  sell_recommendations: TradeRecommendation[];
  buy_recommendations: TradeRecommendation[];
  total_sell_opportunities: number;
  total_buy_opportunities: number;
}

export default function InterstateTradeAnalysis() {
  const [states, setStates] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<TradeAnalysis | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
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

      const { data: yearsData, error: yearsError } = await supabase.rpc('get_distinct_years');

      if (yearsError) {
        const { data: fallbackYears } = await supabase
          .from('crop_production_data')
          .select('crop_year')
          .limit(5000);

        if (fallbackYears) {
          const uniqueYears = [...new Set(fallbackYears.map(d => d.crop_year))].sort();
          setYears(uniqueYears);
        }
      } else if (yearsData) {
        setYears(yearsData.map((d: any) => d.crop_year));
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedState || !selectedYear) {
      setError('Please select both state and year');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-interstate-trade`;
      const url = `${apiUrl}?state_name=${encodeURIComponent(selectedState)}&crop_year=${encodeURIComponent(selectedYear)}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setAnalysis(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze interstate trade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interstate Trade Analysis</h2>
        <p className="text-gray-600">
          Analyze crop surplus and deficit to optimize interstate trade, reduce transportation costs, and minimize environmental impact
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select State *
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            Select Year *
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">Choose a year...</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !selectedState || !selectedYear}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mb-6"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing Trade Opportunities...
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5" />
            Analyze Interstate Trade
          </>
        )}
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-900">Selling Opportunities</h3>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{analysis.total_sell_opportunities}</p>
              <p className="text-sm text-emerald-700 mt-1">Crops with surplus production</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Buying Opportunities</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">{analysis.total_buy_opportunities}</p>
              <p className="text-sm text-blue-700 mt-1">Crops needing procurement</p>
            </div>
          </div>

          {analysis.sell_recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Crops to Sell (Surplus Production)
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.sell_recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="border border-emerald-200 bg-emerald-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{rec.crop}</h4>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                          <span className="text-lg font-semibold text-emerald-700">{rec.partner_state}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{rec.reason}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Distance</p>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{rec.distance_km} km</p>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Quantity</p>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{rec.quantity.toLocaleString()} T</p>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <Leaf className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Environment</p>
                        </div>
                        <p className="text-sm font-medium text-emerald-700">{rec.environmental_benefit}</p>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Cost Savings</p>
                        </div>
                        <p className="text-sm font-medium text-emerald-700">{rec.cost_benefit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.buy_recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Crops to Buy (Deficit Production)
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.buy_recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="border border-blue-200 bg-blue-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{rec.crop}</h4>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                          <span className="text-lg font-semibold text-blue-700">from {rec.partner_state}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{rec.reason}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Distance</p>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{rec.distance_km} km</p>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingDown className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Quantity</p>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{rec.quantity.toLocaleString()} T</p>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <Leaf className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Environment</p>
                        </div>
                        <p className="text-sm font-medium text-blue-700">{rec.environmental_benefit}</p>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-gray-600">Cost Savings</p>
                        </div>
                        <p className="text-sm font-medium text-blue-700">{rec.cost_benefit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.sell_recommendations.length === 0 && analysis.buy_recommendations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No trade opportunities found for the selected state and year.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
