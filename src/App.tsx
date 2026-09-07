import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeDashboardPage } from './pages/HomeDashboardPage';
import { LeaderboardsPage } from './pages/LeaderboardsPage';
import { MapPage } from './pages/MapPage';
import { PlayersPage } from './pages/PlayersPage';
import { ServerInfoPage } from './pages/ServerInfoPage';
import { ActivityPage } from './pages/ActivityPage';
import { StatsPage } from './pages/StatsPage';
import { PageShell } from './components/PageShell';

export function App() {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<HomeDashboardPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/statistics" element={<StatsPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/world-map" element={<MapPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/server-info" element={<ServerInfoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageShell>
  );
}
