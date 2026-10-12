import { useState } from 'react';
import Prov, { Demo } from '../ui/Prov';
import { useApp } from '../../context/AppContext';
import { CHECKLIST, DEMO_PLACES, NUMBERS } from '../../data/demo';
import { km } from '../../utils/format';

const load = () => { try { return JSON.parse(localStorage.getItem('safeearth-checklist') || '{}'); } catch (e) { return {}; } };

export default function EmergencyInfo() {
  const { loc, plS, refresh } = useApp();
  const [done, setDone] = useState(load);
  const toggle = (t) => {
    const next = { ...done, [t]: !done[t] };
    setDone(next);
    try { localStorage.setItem('safeearth-checklist', JSON.stringify(next)); } catch (e) { /* storage unavailable */ }
  };
  const count = CHECKLIST.filter((t) => done[t]).length;
  const real = plS.data ? plS.data.filter((p) => p.kind === 'hospital').map((p) => ({ ...p, d: km(loc, p) })).sort((a, b) => a.d - b.d).slice(0, 5) : null;

  return (
    <div className="grid half">
      <div className="gl p">
        <h3 style={{ fontSize: 15, marginBottom: 6 }}>Emergency numbers (India)</h3>
        {NUMBERS.map(([n, l]) => (
          <a key={n} href={`tel:${n}`} className="row sp" style={{ padding: '9px 0', borderBottom: '1px solid var(--bd)', color: 'inherit', textDecoration: 'none' }}>
            <span>{l}</span><b style={{ color: 'var(--cy)' }}>{n}</b>
          </a>
        ))}
        <div className="mut" style={{ marginTop: 8 }}>Numbers can change. Verify with official sources.</div>
        <div className="row sp" style={{ margin: '14px 0 4px', flexWrap: 'wrap', gap: 6 }}>
          <h3 style={{ fontSize: 15 }}>Nearest hospitals</h3>
          {real ? <Prov state={plS} src="OpenStreetMap" onRetry={refresh.pl} /> : <Demo />}
        </div>
        {real ? (real.length ? real.map((p) => (
          <div key={p.id} className="row sp" style={{ padding: '6px 0', fontSize: 14 }}>
            <span style={{ minWidth: 0 }}>🏥 {p.name || 'Unnamed hospital'}{p.phone && <div className="mut"><a href={`tel:${p.phone}`} style={{ color: 'var(--cy)' }}>{p.phone}</a></div>}</span>
            <span className="mut">{p.d.toFixed(1)} km</span>
          </div>
        )) : <div className="mut">No hospitals found in OpenStreetMap within 10 km. The data may be incomplete.</div>) : (
          <>
            {DEMO_PLACES.filter((p) => p.kind === 'hospital').map((p) => <div key={p.n} className="row" style={{ padding: '5px 0', fontSize: 14 }}><span>{p.i}</span>{p.n}</div>)}
            <div className="mut">Sample names only. Real hospitals load from OpenStreetMap when the backend is running.</div>
          </>
        )}
        <div className="mut" style={{ marginTop: 6 }}>OpenStreetMap is community-maintained. Call ahead to confirm availability.</div>
      </div>
      <div className="gl p">
        <div className="row sp"><h3 style={{ fontSize: 15 }}>Preparedness checklist</h3><span className="pill" style={{ color: 'var(--cy)' }}>{count}/{CHECKLIST.length}</span></div>
        <div style={{ height: 6, borderRadius: 4, background: 'var(--bd)', margin: '10px 0', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(count / CHECKLIST.length) * 100}%`, background: 'linear-gradient(90deg,var(--bl),var(--cy))', transition: 'width .4s', boxShadow: '0 0 10px var(--cy)' }} />
        </div>
        {CHECKLIST.map((t) => (
          <div key={t} className={`ck ${done[t] ? 'on' : ''}`} onClick={() => toggle(t)} role="checkbox" aria-checked={!!done[t]} tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && toggle(t)}>
            <i>{done[t] ? '✓' : ''}</i><span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
