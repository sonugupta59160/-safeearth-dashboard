import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function SOSPanel() {
  const { loc } = useApp();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState('');

  const build = () => {
    const base = 'I need emergency help.';
    if (!navigator.geolocation) { setMsg(`${base} (Location unavailable)`); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setMsg(`${base} My location: https://maps.google.com/?q=${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}`),
      () => setMsg(`${base} (Location permission was not granted. Selected area: ${loc.n})`),
      { timeout: 8000 }
    );
  };
  const start = () => { setOpen(true); setMsg(''); setNote(''); build(); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(msg); setNote('Message copied. Paste it into a text or chat yourself.'); }
    catch (e) { setNote('Copy was blocked. Select the text and copy it manually.'); }
  };
  const share = async () => {
    try { await navigator.share({ text: msg }); setNote('Share sheet opened. Nothing is sent until you choose an app and tap send.'); }
    catch (e) { setNote('Sharing was cancelled.'); }
  };

  return (
    <div className="gl p">
      <div style={{ display: 'grid', placeItems: 'center', padding: '26px 0 18px' }}>
        <button className="sos" onClick={start}>SOS</button>
      </div>
      <p className="mut" style={{ textAlign: 'center', margin: 0 }}>This button does not contact anyone by itself. It helps you call 112 and prepare a location message.</p>
      {open && (
        <div style={{ marginTop: 14, padding: 16, borderRadius: 14, border: '1px solid rgba(239,68,68,.45)', background: 'rgba(239,68,68,.08)', animation: 'fade .25s' }}>
          <b>Do this now</b>
          <a className="btn r" href="tel:112" style={{ margin: '10px 0' }}>1. Open dialer for 112</a>
          <div className="mut">2. Location message you can send to a trusted person:</div>
          <div style={{ margin: '6px 0 10px', padding: 10, borderRadius: 12, border: '1px solid var(--bd)', fontSize: 14, wordBreak: 'break-word' }}>{msg || 'Getting your location…'}</div>
          <div className="grid g2" style={{ gap: 8 }}>
            <button className="btn alt" onClick={copy} disabled={!msg}>Copy message</button>
            {typeof navigator.share === 'function' && <button className="btn alt" onClick={share} disabled={!msg}>Share…</button>}
          </div>
          {note && <p className="mut">{note}</p>}
          <p className="mut" style={{ marginBottom: 0 }}>Nothing has been sent. Help is only requested once you complete a call or message yourself.</p>
        </div>
      )}
    </div>
  );
}
