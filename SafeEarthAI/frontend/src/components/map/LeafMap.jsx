import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { X } from 'lucide-react';
import Prov from '../ui/Prov';
import { useApp } from '../../context/AppContext';
import { ALERTS, DEMO_PLACES } from '../../data/demo';
import { ago, TC, TI } from '../../utils/format';

const CHIPS = [['eq', '🌐 Earthquakes'], ['fire', '🔥 Wildfire'], ['hosp', '🏥 Hospitals'], ['shel', '🏠 Shelters'], ['demo', 'Demo markers']];

export default function LeafMap({ height = 'min(56vh,400px)' }) {
  const { loc, eqS: eq, plS: pl, fireS: fire, refreshAll } = useApp();
  const box = useRef(null), map = useRef(null), layer = useRef(null);
  const [tiles, setTiles] = useState('ok');
  const [sel, setSel] = useState(null);
  const [ly, setLy] = useState({ eq: 1, fire: 1, hosp: 1, shel: 1, demo: 0 });
  const eqOk = eq.st === 'live' || eq.st === 'cached';

  // Create the map once
  useEffect(() => {
    const m = L.map(box.current).setView([loc.lat, loc.lon], 8);
    let errors = 0;
    const tl = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    }).addTo(m);
    tl.on('tileerror', () => { if (++errors > 2) setTiles('blocked'); });
    tl.on('tileload', () => { errors = 0; setTiles('ok'); });
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    setTimeout(() => m.invalidateSize(), 300);
    return () => { m.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If real earthquake data cannot load, show clearly-labelled demo markers so the map is not empty.
  useEffect(() => {
    if (eq.st === 'error') setLy((x) => ({ ...x, demo: 1 }));
    else if (eqOk) setLy((x) => ({ ...x, demo: 0 }));
  }, [eq.st, eqOk]);

  useEffect(() => {
    if (map.current) map.current.flyTo([loc.lat, loc.lon], loc.src === 'gps' ? 11 : 8, { duration: 1.2 });
  }, [loc.lat, loc.lon, loc.src]);

  // Redraw markers when data or layer toggles change
  useEffect(() => {
    const g = layer.current;
    if (!g) return;
    g.clearLayers();
    setSel(null);
    const add = (lat, lon, color, text, info, size = 30, dashed = false) =>
      L.marker([lat, lon], {
        icon: L.divIcon({ className: '', html: `<div class="mk${dashed ? ' d' : ''}" style="--c:${color};width:${size}px;height:${size}px">${text}</div>`, iconSize: [size, size] }),
      }).on('click', () => setSel(info)).addTo(g);

    add(loc.lat, loc.lon, '#22d3ee', '📍', {
      title: loc.n, place: loc.src === 'gps' ? 'Your GPS position' : 'Selected location',
      tip: `Coordinates ${loc.lat.toFixed(3)}, ${loc.lon.toFixed(3)}`,
    });
    if (ly.eq && eqOk) {
      (eq.data || []).forEach((q) => add(q.lat, q.lon, '#818cf8', q.mag.toFixed(1), {
        title: `M${q.mag.toFixed(1)} earthquake`, place: q.place, tip: `${ago(q.time)} · depth ${Math.round(q.depth)} km`,
        src: `USGS (${eq.st})`, link: q.url,
      }, 26 + Math.round(q.mag * 2.5)));
    }
    if (ly.fire && fire.data) {
      fire.data.forEach((h) => add(h.lat, h.lon, '#f59e0b', '🔥', {
        title: 'Satellite heat hotspot', place: `${h.date} ${h.time} UTC · confidence ${h.confidence}`,
        tip: 'Unconfirmed detection. It may be crop burning or industrial heat. Check official updates.', src: `NASA FIRMS (${fire.st})`,
      }, 24));
    }
    (pl.data || []).filter((p) => (p.kind === 'hospital' ? ly.hosp : ly.shel)).forEach((p) => add(p.lat, p.lon,
      p.kind === 'hospital' ? '#10b981' : '#22d3ee', p.kind === 'hospital' ? '🏥' : '🏠', {
        title: p.name || `Unnamed ${p.kind}`,
        place: (p.kind === 'hospital' ? 'Hospital' : 'Shelter or assembly point') + (p.phone ? ` · ${p.phone}` : ''),
        tip: 'OpenStreetMap data is community-maintained and may be incomplete or outdated. Call ahead before travelling.',
        src: `OpenStreetMap (${pl.st})`, link: p.url,
      }));
    if (ly.demo) {
      ALERTS.forEach((a) => add(loc.lat + (37 - a.y) * 0.012, loc.lon + (a.x - 50) * 0.015, TC[a.t], TI[a.t],
        { title: `Demo: ${a.title}`, place: 'Sample marker, not a real alert', tip: a.tip, src: 'DEMO' }, 30, true));
      DEMO_PLACES.forEach((p) => add(loc.lat + (37 - p.y) * 0.012, loc.lon + (p.x - 50) * 0.015, '#8fa6cc', p.i,
        { title: p.n, place: 'Sample marker, not a real facility', tip: 'Real hospitals and shelters load from OpenStreetMap when the backend is running.', src: 'DEMO' }, 28, true));
    }
  }, [eq.data, fire.data, pl.data, ly, loc, eqOk]);

  return (
    <div className="gl p">
      <div className="row sp" style={{ marginBottom: 10 }}>
        <span className="row" style={{ fontSize: 14, minWidth: 0 }}>
          <i className="live" /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Monitoring {loc.n}</span>
        </span>
        <button className="chip" onClick={refreshAll}>↻ Refresh</button>
      </div>
      <div className="scroll">
        {CHIPS.map(([k, l]) => <button key={k} className={`chip ${ly[k] ? 'on' : ''}`} onClick={() => setLy({ ...ly, [k]: ly[k] ? 0 : 1 })}>{l}</button>)}
      </div>
      <div className="mapbox">
        <div ref={box} className="lmap" style={{ height, minHeight: 300 }} />
        {tiles === 'blocked' && (
          <div className="mut" style={{ position: 'absolute', top: 8, left: 8, right: 8, zIndex: 1100, padding: '6px 10px', borderRadius: 10, background: 'rgba(8,15,30,.9)', border: '1px solid var(--bd)', fontSize: 12 }}>
            Map tiles could not load (offline or blocked). Markers still work.
          </div>
        )}
        {sel && (
          <div className="gl p" style={{ position: 'absolute', left: 8, right: 8, bottom: 30, zIndex: 1100, padding: '10px 12px', background: 'rgba(8,15,30,.94)', animation: 'fade .25s' }}>
            <div className="row sp"><b style={{ fontSize: 14 }}>{sel.title}</b>
              <button onClick={() => setSel(null)} aria-label="Close" style={{ background: 'none', border: 0, padding: 0, color: 'var(--mut)' }}><X size={18} /></button></div>
            <div className="mut">{sel.place}</div>
            <div style={{ fontSize: 13.5, marginTop: 3 }}>{sel.tip}</div>
            {sel.src && <div className="mut" style={{ marginTop: 4 }}>Source: {sel.src}{sel.link && <> · <a href={sel.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cy)' }}>details</a></>}</div>}
          </div>
        )}
      </div>
      <div className="row" style={{ marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
        <Prov state={eq} src="USGS" fallback="none" />
        <Prov state={fire} src="NASA FIRMS" fallback="none" />
        <Prov state={pl} src="OSM via backend" fallback="none" />
      </div>
      <div className="mut" style={{ marginTop: 6, fontSize: 12 }}>
        Dashed markers are demo samples. Flood zones and cyclone tracks have no live data source yet, so they are not drawn. Every other marker comes from the source in its badge.
      </div>
    </div>
  );
}
