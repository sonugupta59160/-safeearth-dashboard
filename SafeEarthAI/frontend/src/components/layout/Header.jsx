import { useState } from 'react';
import { Bell, User } from 'lucide-react';
import LocPicker from './LocPicker';
import { Demo } from '../ui/Prov';
import { ALERTS } from '../../data/demo';
import { TI } from '../../utils/format';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { backend, recheck } = useApp();
  const [pop, setPop] = useState(null);
  const [unread, setUnread] = useState(3);
  const toggle = (k) => setPop((p) => (p === k ? null : k));
  const bColor = backend === 'online' ? '#10b981' : backend === 'offline' ? '#f59e0b' : '#22d3ee';
  const bText = backend === 'online' ? 'Backend online' : backend === 'offline' ? 'Backend offline (demo mode)' : 'Checking backend…';

  return (
    <>
      <header>
        <div className="row" style={{ flex: 1 }}>
          <div className="logo">🌍</div>
          <div className="brand"><b>SafeEarth AI</b><div className="mut" style={{ fontSize: 11.5, lineHeight: 1.2 }}>Predict. Prepare. Protect.</div></div>
        </div>
        <LocPicker />
        <button className="ib" aria-label="Notifications" onClick={() => { toggle('bell'); setUnread(0); }}>
          <Bell size={20} className="ic" />{unread > 0 && <span className="dot">{unread}</span>}
        </button>
        <button className="ib" aria-label="Profile and status" onClick={() => toggle('user')}><User size={20} className="ic" /></button>
      </header>
      {pop === 'bell' && (
        <div className="gl pop">
          <b style={{ fontFamily: 'Sora' }}>Notifications</b> <Demo />
          <div style={{ marginTop: 10 }}>
            {ALERTS.slice(0, 3).map((a) => (
              <div key={a.id} className="row" style={{ padding: '7px 0', borderTop: '1px solid var(--bd)', fontSize: 13.5 }}>
                <span>{TI[a.t]}</span><div><div>{a.title}</div><div className="mut">{a.ago} · sample</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {pop === 'user' && (
        <div className="gl pop">
          <b style={{ fontFamily: 'Sora' }}>Status</b>
          <p className="row" style={{ margin: '8px 0', gap: 8 }}><i className="live" style={{ background: bColor, boxShadow: `0 0 10px ${bColor}` }} />{bText}</p>
          <button className="chip" onClick={recheck}>Re-check backend</button>
          <p className="mut" style={{ margin: '10px 0 0' }}>Sign-in and saved places are not part of this version. Nothing is stored about you.</p>
        </div>
      )}
    </>
  );
}
