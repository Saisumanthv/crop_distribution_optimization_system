import { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CropData } from '../types';
import CropDataModal from './CropDataModal';

interface CropDataViewerProps {
  refreshTrigger: number;
}

export default function CropDataViewer({ refreshTrigger }: CropDataViewerProps) {
  const [currentRecord, setCurrentRecord] = useState<CropData | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recordLoading, setRecordLoading] = useState(false);

  useEffect(() => {
    fetchTotalCount();
  }, [refreshTrigger]);

  const fetchTotalCount = async () => {
    setLoading(true);
    try {
      const { count, error: countError } = await supabase
        .from('crop_production_data')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching count:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecordAtIndex = async (index: number) => {
    if (index < 0 || index >= totalCount) return;

    setRecordLoading(true);
    try {
      const { data, error } = await supabase
        .from('crop_production_data')
        .select('*')
        .order('id', { ascending: true })
        .range(index, index)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setCurrentRecord(data[0]);
        setCurrentRecordIndex(index);
      }
    } catch (error) {
      console.error('Error fetching record:', error);
    } finally {
      setRecordLoading(false);
    }
  };

  const handleViewData = async () => {
    if (totalCount > 0) {
      await fetchRecordAtIndex(0);
      setShowModal(true);
    }
  };

  const handleNextRecord = async () => {
    if (currentRecordIndex < totalCount - 1) {
      await fetchRecordAtIndex(currentRecordIndex + 1);
    }
  };

  const handlePreviousRecord = async () => {
    if (currentRecordIndex > 0) {
      await fetchRecordAtIndex(currentRecordIndex - 1);
    }
  };

  const handleGoToRecord = async (index: number) => {
    if (index >= 0 && index < totalCount) {
      await fetchRecordAtIndex(index);
    }
  };

  if (loading || totalCount === 0) {
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
              {totalCount.toLocaleString()} records available for analysis
            </p>
          </div>
          <button
            onClick={handleViewData}
            disabled={recordLoading}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Browse All Records
          </button>
        </div>
      </div>

      {showModal && currentRecord && (
        <CropDataModal
          data={[currentRecord]}
          currentIndex={0}
          totalCount={totalCount}
          absoluteIndex={currentRecordIndex}
          loading={recordLoading}
          onClose={() => setShowModal(false)}
          onNext={handleNextRecord}
          onPrevious={handlePreviousRecord}
          onGoToRecord={handleGoToRecord}
        />
      )}
    </>
  );
}
