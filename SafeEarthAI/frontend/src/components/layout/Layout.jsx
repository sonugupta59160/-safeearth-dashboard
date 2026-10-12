import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Header from './Header';
import BottomNav from './BottomNav';

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return (
    <div className="app">
      <Header />
      <main><Outlet /></main>
      {pathname !== '/assistant' && (
        <Link to="/assistant" className="ai" aria-label="Open AI assistant"><MessageCircle size={22} className="ic" /><span>Ask AI</span></Link>
      )}
      <BottomNav />
    </div>
  );
}
