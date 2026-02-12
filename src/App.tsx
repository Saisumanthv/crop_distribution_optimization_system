import { useState } from 'react';
import { Wheat, BarChart3, Info } from 'lucide-react';
import CropDataFilter from './components/CropDataFilter';
import FilteredDataDisplay from './components/FilteredDataDisplay';
import RecommendationEngine from './components/RecommendationEngine';
import Dashboard from './components/Dashboard';
import CropDataViewer from './components/CropDataViewer';
import InterstateTradeAnalysis from './components/InterstateTradeAnalysis';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filterState, setFilterState] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const handleDataUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFilterApplied = (state: string, year: string) => {
    setFilterState(state);
    setFilterYear(year);
    handleDataUpdate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 p-3 rounded-lg">
              <Wheat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Crop Distribution Optimization System
              </h1>
              <p className="text-gray-600 mt-1">
                Government of India - Strategic Agricultural Planning & Resource Allocation
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <CropDataFilter onFilterApplied={handleFilterApplied} />
        </div>

        <div className="mb-8">
          <FilteredDataDisplay
            state={filterState}
            year={filterYear}
            refreshTrigger={refreshTrigger}
          />
        </div>

        <div className="mb-8">
          <CropDataViewer refreshTrigger={refreshTrigger} />
        </div>

        <div className="mb-8">
          <RecommendationEngine onGenerateComplete={handleDataUpdate} />
        </div>

        <div className="mb-8">
          <InterstateTradeAnalysis />
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          </div>
          <Dashboard refreshTrigger={refreshTrigger} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Key Benefits</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="bg-green-100 p-2 rounded-lg h-fit">
                <Wheat className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Efficient Distribution</h4>
                <p className="text-sm text-gray-600">
                  Matches surplus producing states with deficit states for optimal resource allocation
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-blue-100 p-2 rounded-lg h-fit">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Cost Optimization</h4>
                <p className="text-sm text-gray-600">
                  Minimizes transportation costs by prioritizing shorter distances
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg h-fit">
                <Info className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Environmental Impact</h4>
                <p className="text-sm text-gray-600">
                  Reduces CO₂ emissions by optimizing route selection and minimizing fuel consumption
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Government of India - Ministry of Agriculture & Farmers Welfare
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
