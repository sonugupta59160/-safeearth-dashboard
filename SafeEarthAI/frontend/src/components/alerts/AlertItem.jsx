import { useState } from 'react';
import { SEV, TC, TI } from '../../utils/format';

export default function AlertItem({ a }) {
  const [open, setOpen] = useState(false);
  const [label, color] = SEV[a.s];
  return (
    <div className="gl" style={{ padding: '12px 14px', marginBottom: 10, borderLeft: `3px solid ${color}`, cursor: 'pointer' }} onClick={() => setOpen(!open)}>
      <div className="row">
        <div className="tile" style={{ background: `${TC[a.t]}22`, width: 34, height: 34, fontSize: 17 }}>{TI[a.t]}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5 }}>{a.title}</div>
          <div className="mut">{a.place} · {a.ago}</div>
        </div>
        <span className="pill" style={{ color }}>{label}</span>
      </div>
      {open && <div style={{ marginTop: 8, fontSize: 14, animation: 'fade .25s' }}><b style={{ color: 'var(--cy)' }}>Safety tip:</b> {a.tip}</div>}
    </div>
  );
}
