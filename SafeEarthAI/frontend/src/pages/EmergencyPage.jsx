import SOSPanel from '../components/emergency/SOSPanel';
import EmergencyInfo from '../components/emergency/EmergencyInfo';

export default function EmergencyPage() {
  return (
    <div className="fade" style={{ marginTop: 14 }}>
      <h1 style={{ fontSize: 22, marginBottom: 10 }}>Emergency response</h1>
      <div className="grid" style={{ gap: 14 }}>
        <SOSPanel />
        <EmergencyInfo />
      </div>
    </div>
  );
}
