import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import MapPage from './pages/MapPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';
import WeatherPage from './pages/WeatherPage.jsx';
import AssistantPage from './pages/AssistantPage.jsx';
import EmergencyPage from './pages/EmergencyPage.jsx';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<MapPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="sos" element={<EmergencyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
