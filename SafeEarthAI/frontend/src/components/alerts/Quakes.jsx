import Prov from '../ui/Prov';
import { ago } from '../../utils/format';
import { useApp } from '../../context/AppContext';

export default function Quakes({ limit = 6 }) {
  const { eqS: s, loc, refresh } = useApp();
  const d = s.data;
  return (
    <div className="gl p" style={{ marginBottom: 12 }}>
      <div className="row sp" style={{ flexWrap: 'wrap', gap: 6 }}>
        <h3 style={{ fontSize: 15 }}>Earthquakes within 500 km</h3>
        <Prov state={s} src="USGS" fallback="none" onRetry={refresh.eq} />
      </div>
      <div className="mut" style={{ margin: '2px 0 6px' }}>M2.5+ in the last 7 days around {loc.n}</div>
      {s.st === 'loading' && !d && <div className="mut pulse">Loading earthquake data…</div>}
      {s.st === 'error' && <div className="mut">Could not reach the USGS feed ({s.err}). Nothing is shown rather than guessing.</div>}
      {d && (d.length ? d.slice(0, limit).map((q) => (
        <div key={q.id} className="row" style={{ padding: '7px 0', borderTop: '1px solid var(--bd)' }}>
          <span className="pill" style={{ color: q.mag >= 5 ? '#ef4444' : q.mag >= 4 ? '#f59e0b' : '#818cf8', minWidth: 48, textAlign: 'center' }}>M{q.mag.toFixed(1)}</span>
          <div style={{ flex: 1, minWidth: 0, fontSize: 14 }}>
            {q.place}<div className="mut">{ago(q.time)} · depth {Math.round(q.depth)} km</div>
          </div>
        </div>
      )) : <div className="mut">No M2.5+ earthquakes within 500 km in the last 7 days.</div>)}
    </div>
  );
}
