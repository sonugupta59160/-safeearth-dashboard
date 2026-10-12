import { useEffect, useState } from 'react';

const CACHE = new Map(); // key -> { data, at }  (in-memory, lives until page reload)

/**
 * Fetch with provenance states:
 *  idle     - disabled (e.g. backend not connected)
 *  loading  - request in flight
 *  live     - fetched just now
 *  cached   - served from cache (fresh within ttl, or kept after a failed refresh); `at` = original fetch time
 *  error    - failed and nothing cached
 */
export default function useFetch(key, fn, { ttl = 300000, enabled = true } = {}) {
  const [s, setS] = useState({ st: 'idle' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!enabled) { setS({ k: key, st: 'idle' }); return undefined; }
    let dead = false;
    const hit = CACHE.get(key);
    if (hit && n === 0 && Date.now() - hit.at < ttl) { setS({ k: key, st: 'cached', data: hit.data, at: hit.at }); return undefined; }
    setS((p) => (p.k === key && p.data ? { ...p, st: 'loading' } : { k: key, st: 'loading' }));
    fn()
      .then((data) => {
        if (dead) return;
        const at = (data && data.__at) || Date.now();
        CACHE.set(key, { data, at });
        setS({ k: key, st: data && data.__prov === 'cached' ? 'cached' : 'live', data, at });
      })
      .catch((e) => {
        if (dead) return;
        const old = CACHE.get(key);
        setS(old ? { k: key, st: 'cached', data: old.data, at: old.at, err: e.message } : { k: key, st: 'error', err: e.message });
      });
    return () => { dead = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, n, enabled]);

  return [s, () => setN((x) => x + 1)];
}
