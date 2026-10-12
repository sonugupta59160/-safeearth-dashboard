import Quakes from '../components/alerts/Quakes';
import Wildfires from '../components/alerts/Wildfires';
import SampleAlerts from '../components/alerts/SampleAlerts';

export default function AlertsPage() {
  return (
    <div className="fade" style={{ marginTop: 14 }}>
      <h1 style={{ fontSize: 22, marginBottom: 10 }}>Alerts</h1>
      <div className="grid half">
        <Quakes limit={10} />
        <Wildfires />
      </div>
      <SampleAlerts />
      <div className="gl p" style={{ marginTop: 12 }}>
        <b>Official warnings</b>
        <div className="mut">Flood, cyclone and other official warnings are issued by IMD, CWC, NDMA and your state authority. SafeEarth AI does not issue warnings.</div>
      </div>
    </div>
  );
}
