import { useState, useEffect } from 'react';
import { Table, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CropData } from '../types';

interface FilteredDataDisplayProps {
  state: string;
  year: string;
  refreshTrigger: number;
}

export default function FilteredDataDisplay({ state, year, refreshTrigger }: FilteredDataDisplayProps) {
  const [data, setData] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (state || year) {
      fetchFilteredData();
    } else {
      setData([]);
    }
  }, [state, year, refreshTrigger]);

  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('crop_production_data')
        .select('*')
        .order('crop_year', { ascending: false })
        .order('state_name');

      if (state) {
        query = query.eq('state_name', state);
      }

      if (year) {
        query = query.eq('crop_year', year);
      }

      const { data: result, error } = await query;

      if (error) throw error;

      setData(result || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!state && !year) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading filtered data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Table className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No data found for the selected filters</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-emerald-600 text-white p-6">
        <div className="flex items-center gap-3">
          <Table className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Filtered Results</h3>
        </div>
        <p className="mt-2 text-emerald-100">
          Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} records
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                State
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                District
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Year
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Season
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Crop
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Area (ha)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Production (t)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Yield (kg/ha)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm text-gray-900">{item.state_name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.district_name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{item.crop_year}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.season}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.crop}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {item.area ? item.area.toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {item.production ? item.production.toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {item.yield ? item.yield.toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
