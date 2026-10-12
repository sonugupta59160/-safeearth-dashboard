import { NavLink } from 'react-router-dom';
import { CloudSun, LayoutDashboard, Map as MapIcon, Bell, ShieldAlert } from 'lucide-react';

const TABS = [
  ['/', LayoutDashboard, 'Home'],
  ['/map', MapIcon, 'Map'],
  ['/alerts', Bell, 'Alerts'],
  ['/weather', CloudSun, 'Weather'],
  ['/sos', ShieldAlert, 'SOS'],
];

/** Bottom bar on phones, left sidebar on screens wider than 1000px (see global.css). */
export default function BottomNav() {
  return (
    <nav aria-label="Main navigation">
      {TABS.map(([to, Icon, label]) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `${isActive ? 'on' : ''} ${to === '/sos' ? 's' : ''}`}>
          <Icon size={21} className="ic" />{label}
        </NavLink>
      ))}
    </nav>
  );
}
