import { ago } from '../../utils/format';

export function Demo() {
  return <span className="pill demo">Demo data</span>;
}

/** Provenance badge: live | cached | demo | unavailable | not configured | not connected | loading */
export default function Prov({ state, src, fallback = 'demo', onRetry }) {
  const { st, err = '' } = state;
  let label, color, pulse = false;
  if (st === 'loading') { label = `Loading ${src}…`; color = '#22d3ee'; pulse = true; }
  else if (st === 'live') { label = `Live · ${src}`; color = '#10b981'; }
  else if (st === 'cached') { label = `Cached · ${ago(state.at)} · ${src}`; color = '#60a5fa'; }
  else if (st === 'error') {
    color = '#f59e0b';
    label = /not configured/i.test(err) ? `Not configured · ${src}` : fallback === 'demo' ? `Demo · ${src} unreachable` : `Unavailable · ${src}`;
  } else { label = `Not connected · ${src}`; color = '#f59e0b'; }
  const click = onRetry && st !== 'loading';
  return (
    <span className="pill" title={err} role={click ? 'button' : undefined} onClick={click ? onRetry : undefined}
      style={{ color, cursor: click ? 'pointer' : 'default', animation: pulse ? 'pulse 1.2s infinite' : 'none' }}>
      {label}{click ? ' ↻' : ''}
    </span>
  );
}
