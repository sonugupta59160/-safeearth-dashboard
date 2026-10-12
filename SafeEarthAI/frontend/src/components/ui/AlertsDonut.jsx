import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { ALERTS } from '../../data/demo';
import { TC } from '../../utils/format';

const DATA = Object.keys(TC).map((k) => ({ name: k, value: ALERTS.filter((a) => a.t === k).length })).filter((d) => d.value);

export default function AlertsDonut() {
  const [active, setActive] = useState(null);
  const total = DATA.reduce((a, d) => a + d.value, 0);
  const shown = active ? DATA.find((d) => d.name === active).value : total;
  return (
    <div className="row" style={{ gap: 16 }}>
      <div style={{ position: 'relative', width: 140, height: 140, flex: 'none' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={DATA} dataKey="value" innerRadius={44} outerRadius={64} paddingAngle={3} stroke="none"
              onClick={(d) => setActive(active === d.name ? null : d.name)}>
              {DATA.map((d) => (
                <Cell key={d.name} fill={TC[d.name]} fillOpacity={!active || active === d.name ? 1 : 0.35} style={{ cursor: 'pointer', filter: `drop-shadow(0 0 4px ${TC[d.name]})` }} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none', textAlign: 'center' }}>
          <div><div style={{ font: '700 24px Sora', lineHeight: 1 }}>{shown}</div><div className="mut" style={{ fontSize: 11 }}>{active || 'sample alerts'}</div></div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {DATA.map((d) => (
          <div key={d.name} className="row sp" style={{ padding: '4px 0', fontSize: 14 }}>
            <span><i style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 3, background: TC[d.name], marginRight: 8, boxShadow: `0 0 8px ${TC[d.name]}` }} />{d.name}</span>
            <b>{d.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
