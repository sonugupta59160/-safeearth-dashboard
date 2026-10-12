import Prov from '../ui/Prov';
import { useApp } from '../../context/AppContext';

export default function Wildfires() {
  const { fireS: s, loc, refresh, backend } = useApp();
  const d = s.data;
  return (
    <div className="gl p" style={{ marginBottom: 12 }}>
      <div className="row sp" style={{ flexWrap: 'wrap', gap: 6 }}>
        <h3 style={{ fontSize: 15 }}>Wildfire hotspots within 100 km</h3>
        <Prov state={s} src="NASA FIRMS" fallback="none" onRetry={backend === 'online' ? refresh.fire : undefined} />
      </div>
      <div className="mut" style={{ margin: '2px 0 6px' }}>Satellite heat detections, last 24 hours, around {loc.n}. These are not confirmed fires.</div>
      {s.st === 'idle' && <div className="mut">Needs the Flask backend and a free NASA FIRMS key (see README). Nothing is shown until then.</div>}
      {s.st === 'error' && <div className="mut">Wildfire data is unavailable ({s.err}). Nothing is shown rather than guessing.</div>}
      {d && (d.length ? (
        <div>
          <b style={{ fontSize: 15 }}>{d.length} hotspot{d.length > 1 ? 's' : ''}</b>
          {d.slice(0, 5).map((h, i) => (
            <div key={i} className="row sp" style={{ padding: '6px 0', borderTop: '1px solid var(--bd)', fontSize: 13.5 }}>
              <span>🔥 {h.lat.toFixed(2)}, {h.lon.toFixed(2)}</span>
              <span className="mut">{h.date} {h.time} UTC · conf. {h.confidence}</span>
            </div>
          ))}
        </div>
      ) : <div className="mut">No satellite hotspots detected within 100 km in the last 24 hours.</div>)}
    </div>
  );
}
