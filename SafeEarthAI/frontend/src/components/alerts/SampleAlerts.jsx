import { useState } from 'react';
import AlertItem from './AlertItem';
import { Demo } from '../ui/Prov';
import { ALERTS } from '../../data/demo';

export default function SampleAlerts({ limit }) {
  const [f, setF] = useState('All');
  const list = ALERTS.filter((a) => f === 'All' || a.t === f).slice(0, limit || 99);
  return (
    <div>
      <div className="row sp" style={{ margin: '4px 0 8px' }}><h3 style={{ fontSize: 15 }}>Sample alerts</h3><Demo /></div>
      {!limit && (
        <div className="scroll" style={{ marginBottom: 6 }}>
          {['All', 'Flood', 'Earthquake', 'Wildfire', 'Cyclone'].map((t) => (
            <button key={t} className={`chip ${f === t ? 'on' : ''}`} onClick={() => setF(t)}>{t}</button>
          ))}
        </div>
      )}
      {list.map((a) => <AlertItem key={a.id} a={a} />)}
      {!list.length && <p className="mut">No alerts in this category.</p>}
      <div className="mut">Tap an alert for its safety tip. These are samples, not real warnings.</div>
    </div>
  );
}
