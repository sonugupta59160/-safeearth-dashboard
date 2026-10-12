import { useState } from 'react';
import { Crosshair, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../data/cities';
import { geocode } from '../../services/api';

export default function LocPicker() {
  const { loc, setLoc, backend } = useApp();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState({ st: 'idle' });
  const [gpsMsg, setGpsMsg] = useState('');

  const t = q.trim().toLowerCase();
  const local = (t ? CITIES.filter((c) => c.n.toLowerCase().includes(t)) : CITIES).slice(0, 6);

  const pick = (c) => { setLoc(c); setQ(''); setOpen(false); setOnline({ st: 'idle' }); setGpsMsg(''); };

  const search = async () => {
    setOnline({ st: 'loading' });
    try { setOnline({ st: 'live', data: await geocode(q.trim(), backend === 'online') }); }
    catch (e) { setOnline({ st: 'error', err: e.message }); }
  };

  // GPS is requested only when the user taps the button; the browser shows its own permission prompt.
  const gps = () => {
    setOpen(true);
    if (!navigator.geolocation) { setGpsMsg('This browser does not support location.'); return; }
    setGpsMsg('Waiting for your permission…');
    navigator.geolocation.getCurrentPosition(
      (p) => pick({ n: 'My location (GPS)', lat: p.coords.latitude, lon: p.coords.longitude, src: 'gps' }),
      (e) => setGpsMsg(
        e.code === 1 ? 'Permission denied. Search for a city instead.'
        : e.code === 3 ? 'Location timed out. Try again or search for a city.'
        : 'Location is unavailable. Search for a city instead.'),
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="loc">
      <MapPin size={18} className="ic" />
      <input className="locin" value={open ? q : loc.n} placeholder="Search an Indian city" aria-label="Location search"
        onFocus={() => { setOpen(true); setQ(''); }} onBlur={() => setTimeout(() => setOpen(false), 250)}
        onChange={(e) => { setQ(e.target.value); setOnline({ st: 'idle' }); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { if (local[0]) pick(local[0]); else if (t.length > 2) search(); } }} />
      <button className="gpsb" onClick={gps} aria-label="Use my GPS location"><Crosshair size={20} className="ic" /></button>
      {open && (
        <div className="gl sug">
          <button className="si" onClick={gps}><Crosshair size={16} />Use my current location</button>
          {gpsMsg && <div className="mut" style={{ padding: '2px 8px 6px' }}>{gpsMsg}</div>}
          {local.map((c) => <button key={c.n} className="si" onClick={() => pick(c)}><MapPin size={16} />{c.n}</button>)}
          {t.length > 2 && <button className="si" onClick={search}>🔎 Search online for “{q.trim()}”</button>}
          {online.st === 'loading' && <div className="mut pulse" style={{ padding: 8 }}>Searching OpenStreetMap…</div>}
          {online.st === 'error' && <div className="mut" style={{ padding: 8 }}>Online search unavailable ({online.err}). Pick a city from the list.</div>}
          {online.st === 'live' && (online.data.length
            ? online.data.map((c) => <button key={c.n + c.lat} className="si" onClick={() => pick({ ...c, src: 'search' })}><MapPin size={16} />{c.n}</button>)
            : <div className="mut" style={{ padding: 8 }}>No Indian places found for that search.</div>)}
          <div className="mut" style={{ padding: '6px 8px 0', fontSize: 11.5 }}>Only coordinates are sent to the data services named in each badge.</div>
        </div>
      )}
    </div>
  );
}
