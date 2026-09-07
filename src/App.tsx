import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeDashboardPage } from './pages/HomeDashboardPage';
import { PageShell } from './components/PageShell';

export function App() {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<HomeDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageShell>
  );
}
