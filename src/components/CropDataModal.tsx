import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CropData } from '../types';

interface CropDataModalProps {
  data: CropData[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function CropDataModal({
  data,
  currentIndex,
  onClose,
  onNext,
  onPrevious
}: CropDataModalProps) {
  if (data.length === 0) return null;

  const currentRecord = data[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === data.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Crop Data Record
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-emerald-800 mb-1">State</p>
                <p className="text-lg font-semibold text-emerald-900">{currentRecord.state_name}</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-emerald-800 mb-1">District</p>
                <p className="text-lg font-semibold text-emerald-900">{currentRecord.district_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Crop Year</p>
                <p className="text-lg font-semibold text-blue-900">{currentRecord.crop_year}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Season</p>
                <p className="text-lg font-semibold text-blue-900">{currentRecord.season}</p>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-amber-800 mb-1">Crop</p>
              <p className="text-lg font-semibold text-amber-900">{currentRecord.crop}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-800 mb-1">Area (hectares)</p>
                <p className="text-lg font-semibold text-purple-900">
                  {currentRecord.area?.toLocaleString() || 'N/A'}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-800 mb-1">Production (tonnes)</p>
                <p className="text-lg font-semibold text-purple-900">
                  {currentRecord.production?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Yield (tonnes/hectare)</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentRecord.area && currentRecord.production
                  ? (currentRecord.production / currentRecord.area).toFixed(2)
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrevious}
              disabled={isFirst}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isFirst
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="text-sm font-medium text-gray-600">
              Record {currentIndex + 1} of {data.length}
            </div>

            <button
              onClick={onNext}
              disabled={isLast}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isLast
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
