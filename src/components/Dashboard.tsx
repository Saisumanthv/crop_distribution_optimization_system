import CropStrategiesViewer from './CropStrategiesViewer';

interface DashboardProps {
  refreshTrigger: number;
}

export default function Dashboard({ refreshTrigger }: DashboardProps) {
  return <CropStrategiesViewer refreshTrigger={refreshTrigger} />;
}
