import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Sparkles, TrendingUp, Calendar, MapPin, Leaf } from 'lucide-react';

interface CropStrategy {
  id: string;
  state_name: string;
  crop_year: string;
  crop: string;
  season: string;
  recommended_area: number;
  predicted_yield: number;
  predicted_production: number;
  priority_score: number;
  strategy_notes: string;
  created_at: string;
}

interface CropStrategiesViewerProps {
  refreshTrigger: number;
}

export default function CropStrategiesViewer({ refreshTrigger }: CropStrategiesViewerProps) {
  const [strategies, setStrategies] = useState<CropStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    fetchStrategies();
  }, [refreshTrigger, selectedState, selectedYear]);

  // Separate effect to detect when refreshTrigger changes (indicating new generation)
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchMostRecentState();
    }
  }, [refreshTrigger]);

  const fetchMostRecentState = async () => {
    try {
      // Get the most recently created strategy to determine which state to show
      const { data: recentStrategy } = await supabase
        .from('crop_strategies')
        .select('state_name, crop_year')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (recentStrategy) {
        setSelectedState(recentStrategy.state_name);
        setSelectedYear(recentStrategy.crop_year);
      }
    } catch (error) {
      console.error('Error fetching most recent state:', error);
    }
  };

  const fetchStrategies = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('crop_strategies')
        .select('*')
        .order('priority_score', { ascending: false });

      if (selectedState) {
        query = query.eq('state_name', selectedState);
      }

      if (selectedYear) {
        query = query.eq('crop_year', selectedYear);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;

      setStrategies(data || []);

      const statesQuery = await supabase
        .from('crop_strategies')
        .select('state_name')
        .order('state_name', { ascending: true });

      if (statesQuery.data) {
        const uniqueStates = [...new Set(statesQuery.data.map(s => s.state_name))];
        setAvailableStates(uniqueStates);
        // Auto-select first state if no state is selected OR if current state is not in the list
        if (uniqueStates.length > 0) {
          if (!selectedState || !uniqueStates.includes(selectedState)) {
            setSelectedState(uniqueStates[0]);
          }
        }
      }

      const yearsQuery = await supabase
        .from('crop_strategies')
        .select('crop_year')
        .order('crop_year', { ascending: false });

      if (yearsQuery.data) {
        const uniqueYears = [...new Set(yearsQuery.data.map(s => s.crop_year))];
        setAvailableYears(uniqueYears);
        if (!selectedYear && uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching strategies:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRecommendedArea = strategies.reduce((sum, s) => sum + s.recommended_area, 0);
  const totalPredictedProduction = strategies.reduce((sum, s) => sum + s.predicted_production, 0);
  const avgYield = strategies.length > 0
    ? strategies.reduce((sum, s) => sum + s.predicted_yield, 0) / strategies.length
    : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-gray-600">Loading strategies...</p>
      </div>
    );
  }

  if (strategies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Crop Strategies Yet</h3>
        <p className="text-gray-500">
          Select a state and year, then generate crop strategies to see recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-800">Crop Growing Strategies</h2>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900">Total Strategies</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{strategies.length}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Recommended Area</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {(totalRecommendedArea / 1000).toFixed(1)}K ha
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-medium text-amber-900">Avg Yield</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {avgYield.toFixed(2)} T/ha
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{strategy.crop}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      strategy.priority_score > 50
                        ? 'bg-emerald-100 text-emerald-800'
                        : strategy.priority_score > 20
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      Priority: {strategy.priority_score.toFixed(0)}
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                      {strategy.season}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {strategy.state_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {strategy.crop_year}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Recommended Area</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {strategy.recommended_area.toLocaleString()} ha
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Predicted Yield</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {strategy.predicted_yield.toFixed(2)} T/ha
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Predicted Production</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {strategy.predicted_production.toLocaleString()} T
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-sm text-emerald-900">
                  <strong>Strategy:</strong> {strategy.strategy_notes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
