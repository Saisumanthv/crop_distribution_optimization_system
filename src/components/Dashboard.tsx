import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Recommendation, CropData } from '../types';
import { TrendingUp, ArrowRight, Truck, Leaf, DollarSign, MapPin, Database } from 'lucide-react';
import CropDataModal from './CropDataModal';

interface DashboardProps {
  refreshTrigger: number;
}

export default function Dashboard({ refreshTrigger }: DashboardProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);

  useEffect(() => {
    fetchRecommendations();
    fetchCropData();
  }, [refreshTrigger, selectedYear]);

  const fetchCropData = async () => {
    try {
      let query = supabase
        .from('crop_production_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedYear) {
        query = query.eq('crop_year', selectedYear);
      }

      const { data, error } = await query;

      if (error) throw error;

      setCropData(data || []);
    } catch (error) {
      console.error('Error fetching crop data:', error);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('transaction_recommendations')
        .select('*')
        .order('priority_score', { ascending: false });

      if (selectedYear) {
        query = query.eq('crop_year', selectedYear);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      setRecommendations(data || []);

      const yearsQuery = await supabase
        .from('transaction_recommendations')
        .select('crop_year')
        .order('crop_year', { ascending: false });

      if (yearsQuery.data) {
        const uniqueYears = [...new Set(yearsQuery.data.map(r => r.crop_year))];
        setAvailableYears(uniqueYears);
        if (!selectedYear && uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCropData = () => {
    if (cropData.length > 0) {
      setCurrentDataIndex(0);
      setShowModal(true);
    }
  };

  const handleNextRecord = () => {
    if (currentDataIndex < cropData.length - 1) {
      setCurrentDataIndex(currentDataIndex + 1);
    }
  };

  const handlePreviousRecord = () => {
    if (currentDataIndex > 0) {
      setCurrentDataIndex(currentDataIndex - 1);
    }
  };

  const totalTransactions = recommendations.length;
  const totalQuantity = recommendations.reduce((sum, r) => sum + r.recommended_quantity, 0);
  const totalCost = recommendations.reduce((sum, r) => sum + r.estimated_cost, 0);
  const totalCO2 = recommendations.reduce((sum, r) => sum + r.estimated_co2, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-gray-600">Loading recommendations...</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recommendations Yet</h3>
        <p className="text-gray-500">
          Import crop data and generate recommendations to see optimal transaction suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-800">Transaction Recommendations</h2>
          </div>
          <div className="flex items-center gap-3">
            {cropData.length > 0 && (
              <button
                onClick={handleViewCropData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Database className="w-5 h-5" />
                View All Data ({cropData.length})
              </button>
            )}
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Transactions</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900">Total Quantity</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{(totalQuantity / 1000).toFixed(1)}K T</p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-medium text-amber-900">Est. Cost</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">₹{(totalCost / 100000).toFixed(1)}L</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">CO₂ Impact</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{(totalCO2 / 1000).toFixed(1)}T</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity (T)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CO₂
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recommendations.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        rec.priority_score > 100 ? 'bg-green-100 text-green-800' :
                        rec.priority_score > 50 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {rec.priority_score.toFixed(0)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{rec.crop}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{rec.surplus_state}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{rec.deficit_state}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {rec.recommended_quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {rec.distance_km.toFixed(0)} km
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ₹{rec.estimated_cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {rec.estimated_co2.toFixed(1)} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CropDataModal
          data={cropData}
          currentIndex={currentDataIndex}
          onClose={() => setShowModal(false)}
          onNext={handleNextRecord}
          onPrevious={handlePreviousRecord}
        />
      )}
    </div>
  );
}
