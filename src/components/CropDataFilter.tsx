import { useState, useEffect } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CropDataFilterProps {
  onFilterApplied: (state: string, year: string) => void;
}

export default function CropDataFilter({ onFilterApplied }: CropDataFilterProps) {
  const [states, setStates] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const { data: statesData } = await supabase
        .from('crop_production_data')
        .select('state_name')
        .order('state_name');

      const { data: yearsData } = await supabase
        .from('crop_production_data')
        .select('crop_year')
        .order('crop_year', { ascending: false });

      if (statesData) {
        const uniqueStates = [...new Set(statesData.map(d => d.state_name))];
        setStates(uniqueStates);
      }

      if (yearsData) {
        const uniqueYears = [...new Set(yearsData.map(d => d.crop_year))];
        setYears(uniqueYears);
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const handleSearch = async () => {
    if (!selectedState && !selectedYear) {
      setMessage('Please select at least one filter (State or Year)');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let query = supabase
        .from('crop_production_data')
        .select('*', { count: 'exact' });

      if (selectedState) {
        query = query.eq('state_name', selectedState);
      }

      if (selectedYear) {
        query = query.eq('crop_year', selectedYear);
      }

      const { count, error } = await query;

      if (error) throw error;

      setMessage(`Found ${count} records matching your filters`);
      onFilterApplied(selectedState, selectedYear);
    } catch (error) {
      setMessage('Error searching data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedState('');
    setSelectedYear('');
    setMessage('');
    onFilterApplied('', '');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-6 h-6 text-emerald-600" />
        <h2 className="text-xl font-semibold text-gray-800">Filter Crop Data</h2>
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
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          disabled={loading || (!selectedState && !selectedYear)}
          className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          Search Data
        </button>

        {(selectedState || selectedYear) && (
          <button
            onClick={handleClear}
            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Clear
          </button>
        )}
      </div>

      {message && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
          {message}
        </div>
      )}
    </div>
  );
}
