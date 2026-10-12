// The only file that talks to the network. Weather and earthquakes come straight from the public
// Open-Meteo and USGS APIs (free, no key, CORS-enabled). Everything that needs a secret or
// rate-limit protection (Gemini, Nominatim, Overpass, NASA FIRMS) goes through the Flask backend.
import { WMO } from '../utils/format';

const API = import.meta.env.VITE_API_BASE || '';

export async function getJSON(url, opt = {}, ms = 10000) {
  const c = new AbortController();
  const timer = setTimeout(() => c.abort(), ms);
  try {
    const r = await fetch(url, { ...opt, signal: c.signal });
    if (!r.ok) {
      let m = `HTTP ${r.status}`;
      try { const b = await r.json(); m = (b.error && b.error.message) || m; } catch (_) { /* not JSON */ }
      throw new Error(m);
    }
    return await r.json();
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('request timed out');
    if (e.message === 'Failed to fetch') throw new Error('network blocked or offline');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export const checkHealth = () => getJSON(`${API}/api/health`, {}, 4000);

export async function fetchWeather(lat, lon) {
  const j = await getJSON(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}` +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m' +
      '&hourly=temperature_2m,precipitation_probability' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto'
  );
  const c = j.current, H = j.hourly;
  const start = Math.max(0, H.time.findIndex((t) => t >= c.time.slice(0, 13) + ':00'));
  const idx = [...Array(12)].map((_, k) => start + k * 2).filter((i) => i < H.time.length);
  const [cond, icon] = WMO(c.weather_code);
  return {
    t: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature),
    hum: Math.round(c.relative_humidity_2m), wind: Math.round(c.wind_speed_10m),
    pres: Math.round(c.surface_pressure), rain: H.precipitation_probability[start] ?? 0, cond, icon,
    hrs: idx.map((i) => Math.round(H.temperature_2m[i])),
    hl: idx.map((i) => { const hh = +H.time[i].slice(11, 13); return (hh % 12 || 12) + (hh < 12 ? 'a' : 'p'); }),
    days: j.daily.time.map((d, i) => [
      new Date(`${d}T00:00`).toLocaleDateString('en', { weekday: 'short' }),
      WMO(j.daily.weather_code[i])[1],
      Math.round(j.daily.temperature_2m_max[i]), Math.round(j.daily.temperature_2m_min[i]),
    ]),
  };
}

export async function fetchQuakes(lat, lon) {
  const start = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 19);
  const j = await getJSON(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}` +
      `&maxradiuskm=500&minmagnitude=2.5&orderby=time&limit=30&starttime=${start}`
  );
  return j.features.filter((f) => f.properties.mag != null).map((f) => ({
    id: f.id, mag: f.properties.mag, place: f.properties.place || 'Unnamed region', time: f.properties.time,
    url: f.properties.url, lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], depth: f.geometry.coordinates[2] || 0,
  }));
}

// Backend responses carry provenance in meta; copy it onto the array so useFetch can show "cached".
const withMeta = (arr, meta) => {
  arr.__prov = meta.provenance;
  arr.__at = Date.parse(meta.fetched_at || '') || Date.now();
  return arr;
};

export async function fetchPlaces(lat, lon) {
  const j = await getJSON(`${API}/api/places?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&radius=10000`, {}, 35000);
  return withMeta(j.data.places, j.meta);
}

export async function fetchWildfires(lat, lon) {
  const j = await getJSON(`${API}/api/wildfires?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&radius_km=100`, {}, 30000);
  return withMeta(j.data.hotspots, j.meta);
}

export async function geocode(q, viaBackend) {
  if (viaBackend) {
    const j = await getJSON(`${API}/api/geocode?q=${encodeURIComponent(q)}`);
    return j.data.map((x) => ({ n: x.name, lat: x.lat, lon: x.lon }));
  }
  const j = await getJSON(`https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=in&limit=5&q=${encodeURIComponent(q)}`);
  return j.map((x) => ({ n: x.display_name.split(', ').slice(0, 3).join(', '), lat: +x.lat, lon: +x.lon }));
}

export async function sendChat(message, history, loc) {
  const j = await getJSON(
    `${API}/api/assistant/chat`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history.slice(-8).map((x) => ({ role: x.r === 'me' ? 'user' : 'assistant', content: x.t })),
        location: { name: loc.n, lat: loc.lat, lon: loc.lon },
      }),
    },
    30000
  );
  return j.data.reply;
}
