import { riskLevel, TC, TI } from '../../utils/format';

function Ring({ v, c, s = 96 }) {
  const C = 2 * Math.PI * 40;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 7px ${c})` }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(120,170,255,.15)" strokeWidth="9" />
      <circle cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={C} strokeDashoffset={C * (1 - v / 100)} style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)' }} />
    </svg>
  );
}

function Mini({ v, c }) {
  const pts = Array.from({ length: 12 }, (_, i) => Math.max(5, Math.min(95, v + Math.sin(i * 1.7 + v) * 9 - (11 - i) * (v > 50 ? 1.1 : -0.3))));
  const d = pts.map((y, i) => `${i ? 'L' : 'M'}${i * 10.9} ${30 - y * 0.28}`).join('');
  return (
    <svg viewBox="0 0 120 30" width="100%" height="28">
      <path d={d} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" pathLength="1" className="draw" />
    </svg>
  );
}

export default function RiskCard({ kind, value }) {
  const [label, color] = riskLevel(value);
  return (
    <div className="gl rc p">
      <div className="row sp">
        <div className="tile" style={{ background: `${TC[kind]}22`, boxShadow: `0 0 16px ${TC[kind]}55` }}>{TI[kind]}</div>
        <span className="pill" style={{ color }}>{label}</span>
      </div>
      <div style={{ position: 'relative', display: 'grid', placeItems: 'center', margin: '8px 0 2px' }}>
        <Ring v={value} c={color} />
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ font: '700 24px Sora', lineHeight: 1 }}>{value}%</div>
          <div className="mut" style={{ fontSize: 11 }}>demo score</div>
        </div>
      </div>
      <div style={{ fontWeight: 600 }}>{kind} risk</div>
      <Mini v={value} c={color} />
    </div>
  );
}
