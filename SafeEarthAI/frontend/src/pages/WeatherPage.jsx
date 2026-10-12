import WeatherPanel from '../components/weather/WeatherPanel';

export default function WeatherPage() {
  return (
    <div className="fade" style={{ marginTop: 14 }}>
      <h1 style={{ fontSize: 22, marginBottom: 10 }}>Weather monitoring</h1>
      <WeatherPanel />
    </div>
  );
}
