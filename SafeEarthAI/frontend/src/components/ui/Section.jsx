export default function Section({ id, title, right, children }) {
  return (
    <section id={id} className="sec" style={{ marginTop: 22 }}>
      <div className="row sp" style={{ flexWrap: 'wrap', gap: 6 }}>
        <h2>{title}</h2>
        {right}
      </div>
      <div style={{ marginTop: 8 }}>{children}</div>
    </section>
  );
}
