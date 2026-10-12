// Minimal, safe markdown: **bold** and "- " bullets only. No HTML is ever injected.
const bold = (s) => s.split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p));

export default function Markdown({ text }) {
  return (
    <div>
      {text.split('\n').map((l, i) =>
        l.startsWith('- ') ? <ul key={i} style={{ margin: '2px 0', paddingLeft: 18 }}><li>{bold(l.slice(2))}</li></ul> : <div key={i}>{bold(l)}</div>
      )}
    </div>
  );
}
