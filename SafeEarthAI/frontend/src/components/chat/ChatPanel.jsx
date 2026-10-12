import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import Markdown from './Markdown';
import { useApp } from '../../context/AppContext';
import { KB, KB_FALLBACK, SUGGESTIONS } from '../../data/demo';
import { sendChat } from '../../services/api';

export default function ChatPanel() {
  const { loc, backend } = useApp();
  const online = backend === 'online';
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [msgs, busy]);

  const ask = async (q) => {
    q = q.trim();
    if (!q || busy) return;
    const history = msgs;
    setMsgs((x) => [...x, { r: 'me', t: q }]);
    setText('');
    setBusy(true);
    const tip = KB.find(([re]) => re.test(q.toLowerCase()));
    if (online) {
      try {
        const reply = await sendChat(q, history, loc);
        setMsgs((x) => [...x, { r: 'bot', t: reply }]);
      } catch (e) {
        setMsgs((x) => [...x, { r: 'bot', t: `**Assistant unavailable:** ${e.message}.\n${tip ? `Offline tip instead:\n${tip[1]}` : 'Please try again shortly. In an emergency call **112**.'}` }]);
      }
    } else {
      await new Promise((r) => setTimeout(r, 700));
      setMsgs((x) => [...x, { r: 'bot', t: tip ? tip[1] : KB_FALLBACK }]);
    }
    setBusy(false);
  };

  const status = online ? ['AI via backend', 'var(--em)'] : backend === 'checking' ? ['Checking backend…', 'var(--cy)'] : ['Offline tips', 'var(--or)'];
  const greeting = online
    ? 'Hi, I\'m the SafeEarth guide. Answers come from an AI model through the SafeEarth backend and can be wrong. **Verify with official sources, and call 112 in an emergency.** Ask me anything below.'
    : 'Hi, I\'m the SafeEarth guide. **The backend is not reachable, so I answer from a small built-in tips library, not a live AI model.** Ask me anything below.';

  return (
    <div className="gl p chatbox">
      <div className="row sp" style={{ marginBottom: 6 }}>
        <h3 style={{ fontSize: 15 }}>SafeEarth Assistant</h3>
        <span className="pill" style={{ color: status[1] }}>{status[0]}</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div className="bub bot"><Markdown text={greeting} /></div>
        {msgs.map((m, i) => <div key={i} className={`bub ${m.r}`}><Markdown text={m.t} /></div>)}
        {busy && <div className="bub bot dots"><span /><span /><span /></div>}
        <div ref={end} />
      </div>
      <div className="scroll" style={{ margin: '8px 0' }}>
        {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>)}
      </div>
      <div className="row">
        <input className="in" value={text} placeholder="Ask about a disaster…" maxLength={1000}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask(text)} />
        <button className="ib" aria-label="Send" onClick={() => ask(text)}
          style={{ width: 48, height: 48, background: 'linear-gradient(135deg,var(--bl),var(--cy))', color: '#04101f', border: 0 }}><Send size={20} /></button>
      </div>
    </div>
  );
}
