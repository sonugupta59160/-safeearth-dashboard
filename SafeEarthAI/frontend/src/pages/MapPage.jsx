import LeafMap from '../components/map/LeafMap';

export default function MapPage() {
  return (
    <div className="fade" style={{ marginTop: 14 }}>
      <h1 style={{ fontSize: 22, marginBottom: 10 }}>Disaster risk map</h1>
      <LeafMap height="min(66vh,560px)" />
    </div>
  );
}
