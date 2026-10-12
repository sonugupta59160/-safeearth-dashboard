import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import Prov, { Demo } from '../components/ui/Prov';
import RiskCard from '../components/ui/RiskCard';
import TrendChart from '../components/ui/TrendChart';
import AlertsDonut from '../components/ui/AlertsDonut';
import Quakes from '../components/alerts/Quakes';
import SampleAlerts from '../components/alerts/SampleAlerts';
import { useApp } from '../context/AppContext';
import { DEMO_RISK, TREND_LABELS, TREND_SERIES } from '../data/demo';

export default function Home() {
  const { loc, wx, wxS, refresh } = useApp();
  return (
    <div className="fade">
      <div style={{ margin: '14px 0 12px' }}>
        <h1 style={{ fontSize: 22 }}>Disaster intelligence</h1>
        <div className="mut">Weather and earthquakes load from live public sources when reachable. Risk scores, trends and sample alerts are demo data. In an emergency call 112.</div>
      </div>
      <div className="grid half">
        <Link to="/weather" className="gl p rc" style={{ color: 'inherit', textDecoration: 'none' }}>
          <div className="row sp" style={{ flexWrap: 'wrap', gap: 6 }}>
            <span className="mut">{loc.n}</span>
            <Prov state={wxS} src="Open-Meteo" onRetry={refresh.wx} />
          </div>
          <div className="row sp" style={{ marginTop: 6 }}>
            <div>
              <div style={{ font: '700 44px Sora', lineHeight: 1 }}>{wx.t}°C</div>
              <div className="mut">{wx.cond} · {wx.hum}% humidity · {wx.wind} km/h wind · {wx.rain}% rain chance</div>
            </div>
            <div style={{ fontSize: 48 }}>{wx.icon}</div>
          </div>
        </Link>
        <Quakes limit={3} />
      </div>
      <Section id="risk" title="Risk levels" right={<Demo />}>
        <div className="grid g2 g4">
          {Object.entries(DEMO_RISK).map(([k, v]) => <RiskCard key={k} kind={k} value={v} />)}
        </div>
        <div className="mut" style={{ marginTop: 8 }}>Scores are illustrative. They are not forecasts and do not depend on the selected city.</div>
      </Section>
      <Section id="analytics" title="Analytics" right={<Demo />}>
        <div className="grid split">
          <div className="gl p"><h3 style={{ fontSize: 15, marginBottom: 8 }}>7-day trends</h3>
            <TrendChart gid="tr" labels={TREND_LABELS} series={TREND_SERIES} threshold={6} /></div>
          <div className="gl p"><h3 style={{ fontSize: 15, marginBottom: 10 }}>Sample alerts by type</h3><AlertsDonut /></div>
        </div>
      </Section>
      <Section id="latest" title="Latest alerts" right={<Link to="/alerts" className="chip" style={{ textDecoration: 'none', color: 'inherit' }}>View all</Link>}>
        <SampleAlerts limit={3} />
      </Section>
    </div>
  );
}
