import { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CropData } from '../types';
import CropDataModal from './CropDataModal';

interface CropDataViewerProps {
  refreshTrigger: number;
}

export default function CropDataViewer({ refreshTrigger }: CropDataViewerProps) {
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCropData();
  }, [refreshTrigger]);

  const fetchCropData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crop_production_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      setCropData(data || []);
    } catch (error) {
      console.error('Error fetching crop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewData = () => {
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

  const handleGoToRecord = (index: number) => {
    if (index >= 0 && index < cropData.length) {
      setCurrentDataIndex(index);
    }
  };

  if (loading || cropData.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Imported Crop Data</h3>
            </div>
            <p className="text-blue-100">
              {cropData.length.toLocaleString()} records available for analysis
            </p>
          </div>
          <button
            onClick={handleViewData}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Browse All Records
          </button>
        </div>
      </div>

      {showModal && (
        <CropDataModal
          data={cropData}
          currentIndex={currentDataIndex}
          onClose={() => setShowModal(false)}
          onNext={handleNextRecord}
          onPrevious={handlePreviousRecord}
          onGoToRecord={handleGoToRecord}
        />
      )}
    </>
  );
}
