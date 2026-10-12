import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { CITIES } from '../data/cities';
import { DEMO_WX } from '../data/demo';
import { checkHealth, fetchPlaces, fetchQuakes, fetchWeather, fetchWildfires } from '../services/api';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [loc, setLoc] = useState(CITIES[0]);
  const [backend, setBackend] = useState('checking'); // checking | online | offline

  const recheck = useCallback(() => {
    setBackend('checking');
    checkHealth().then(() => setBackend('online')).catch(() => setBackend('offline'));
  }, []);
  useEffect(recheck, [recheck]);

  const k = `${loc.lat.toFixed(2)},${loc.lon.toFixed(2)}`;
  const [wxS, wxR] = useFetch(`wx:${k}`, () => fetchWeather(loc.lat, loc.lon));
  const [eqS, eqR] = useFetch(`eq:${k}`, () => fetchQuakes(loc.lat, loc.lon));
  const online = backend === 'online';
  const [plS, plR] = useFetch(`pl:${k}`, () => fetchPlaces(loc.lat, loc.lon), { enabled: online });
  const [fireS, fireR] = useFetch(`fire:${k}`, () => fetchWildfires(loc.lat, loc.lon), { enabled: online });

  const value = useMemo(() => ({
    loc, setLoc, backend, recheck,
    wx: wxS.data || DEMO_WX, wxS, eqS, plS, fireS,
    refreshAll: () => { wxR(); eqR(); plR(); fireR(); recheck(); },
    refresh: { wx: wxR, eq: eqR, pl: plR, fire: fireR },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [loc, backend, wxS, eqS, plS, fireS]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
