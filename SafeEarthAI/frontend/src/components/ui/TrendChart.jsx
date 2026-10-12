import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/** Interactive area chart. series: [{name, d:number[], color, unit}], labels: string[] */
export default function TrendChart({ series, labels, gid, threshold, height = 190 }) {
  const [s, setS] = useState(0);
  const q = series[s];
  const data = labels.map((l, i) => ({ l, v: q.d[i] }));
  return (
    <div>
      {series.length > 1 && (
        <div className="scroll" style={{ marginBottom: 6 }}>
          {series.map((x, j) => (
            <button key={x.name} className={`chip ${s === j ? 'on' : ''}`} onClick={() => setS(j)}>{x.name}</button>
          ))}
        </div>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart key={s} data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id={`${gid}${s}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={q.color} stopOpacity={0.45} />
                <stop offset="1" stopColor={q.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(120,170,255,.1)" vertical={false} />
            <XAxis dataKey="l" tick={{ fill: '#8fa6cc', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8fa6cc', fontSize: 11 }} axisLine={false} tickLine={false} width={44} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ background: 'rgba(8,15,30,.95)', border: '1px solid rgba(90,160,255,.3)', borderRadius: 10, color: '#e8f1ff' }}
              formatter={(v) => [`${v} ${q.unit}`, q.name]}
            />
            {threshold && s === 0 && (
              <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'danger level', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            )}
            <Area type="monotone" dataKey="v" stroke={q.color} strokeWidth={2.6} fill={`url(#${gid}${s})`}
              dot={{ r: 3, fill: q.color }} activeDot={{ r: 6 }} animationDuration={900} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mut" style={{ fontSize: 12 }}>Touch or hover the chart to inspect values.</div>
    </div>
  );
}
