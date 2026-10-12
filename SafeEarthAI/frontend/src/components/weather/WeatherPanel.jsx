import Prov from '../ui/Prov';
import TrendChart from '../ui/TrendChart';
import { useApp } from '../../context/AppContext';

export default function WeatherPanel() {
  const { wx: W, wxS, loc, refresh } = useApp();
  return (
    <div style={{ opacity: wxS.st === 'loading' ? 0.55 : 1, transition: 'opacity .3s' }}>
      <div className="row sp" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
        <span className="mut">{loc.n}</span>
        <Prov state={wxS} src="Open-Meteo" onRetry={refresh.wx} />
      </div>
      <div className="grid split">
        <div className="gl p">
          <div className="row sp">
            <div>
              <div style={{ font: '700 54px Sora', lineHeight: 1, background: 'linear-gradient(135deg,#fff,var(--cy))', WebkitBackgroundClip: 'text', color: 'transparent' }}>{W.t}°C</div>
              <div className="mut">{W.cond} · feels like {W.feels}°C</div>
            </div>
            <div style={{ fontSize: 58, filter: 'drop-shadow(0 0 14px rgba(34,211,238,.6))' }} className="pulse">{W.icon}</div>
          </div>
          <div className="grid g2" style={{ marginTop: 14, gap: 10 }}>
            {[['💧', 'Humidity', `${W.hum}%`], ['💨', 'Wind', `${W.wind} km/h`], ['☔', 'Rain chance', `${W.rain}%`], ['🧭', 'Pressure', `${W.pres} hPa`]].map(([i, l, v]) => (
              <div key={l} style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(8,15,30,.5)', border: '1px solid var(--bd)' }}>
                <div className="mut">{i} {l}</div><b>{v}</b>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            {W.days.map(([d, i, hi, lo]) => (
              <div key={d} className="row sp" style={{ padding: '6px 0', borderTop: '1px solid var(--bd)' }}>
                <span style={{ width: 40 }}>{d}</span><span style={{ fontSize: 20 }}>{i}</span>
                <span><b>{hi}°</b> <span className="mut">{lo}°</span></span>
              </div>
            ))}
          </div>
        </div>
        <div className="gl p">
          <h3 style={{ fontSize: 15, marginBottom: 8 }}>Temperature, next 24 h</h3>
          <TrendChart gid="wx" labels={W.hl} series={[{ name: 'Temperature', d: W.hrs, color: '#f59e0b', unit: '°C' }]} />
        </div>
      </div>
      {wxS.st === 'error' && <p className="mut">Showing sample conditions because live weather could not load ({wxS.err}).</p>}
    </div>
  );
}
