export const TC = { Flood: '#22d3ee', Earthquake: '#818cf8', Wildfire: '#f59e0b', Cyclone: '#f43f5e' };
export const TI = { Flood: '🌊', Earthquake: '🌐', Wildfire: '🔥', Cyclone: '🌀' };
export const SEV = { high: ['High', '#ef4444'], med: ['Moderate', '#f59e0b'], low: ['Low', '#10b981'] };

export const riskLevel = (v) => (v >= 65 ? ['High', '#ef4444'] : v >= 35 ? ['Moderate', '#f59e0b'] : ['Low', '#10b981']);

export function ago(t) {
  const m = Math.max(0, Math.round((Date.now() - t) / 6e4));
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} d ago`;
}

// WMO weather code -> [description, emoji]
export function WMO(c) {
  if (c === 0) return ['Clear sky', '☀️'];
  if (c < 3) return ['Partly cloudy', '⛅'];
  if (c === 3) return ['Overcast', '☁️'];
  if (c < 49) return ['Fog', '🌫️'];
  if (c < 58) return ['Drizzle', '🌦️'];
  if (c < 68) return ['Rain', '🌧️'];
  if (c < 78) return ['Snow', '❄️'];
  if (c < 83) return ['Rain showers', '🌦️'];
  if (c < 87) return ['Snow showers', '❄️'];
  return ['Thunderstorm', '⛈️'];
}

// Great-circle distance in km (haversine)
export function km(a, b) {
  const r = (d) => (d * Math.PI) / 180;
  const dLat = r(b.lat - a.lat), dLon = r(b.lon - a.lon);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(x));
}
