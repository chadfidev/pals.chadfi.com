import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  BarElement
} from 'chart.js';
import { GlassPanel } from '../components/GlassPanel';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { dashboardApi } from '../services/dashboardService';
import { DashboardStats } from '../types/dashboard';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement, Title, Tooltip, Legend);

export function StatsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      setError((err as Error).message || 'Unable to load statistics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const playerCountData = useMemo(() => {
    if (!stats) return null;
    return {
      labels: stats.playerCountHistory.map((item) => item.timestamp),
      datasets: [
        {
          label: 'Players Online',
          data: stats.playerCountHistory.map((item) => item.players),
          borderColor: '#48C7FF',
          backgroundColor: '#48C7FF88',
          tension: 0.3,
          fill: true
        }
      ]
    };
  }, [stats]);

  const activityData = useMemo(() => {
    if (!stats) return null;
    return {
      labels: stats.activityHistory.map((item) => item.timestamp),
      datasets: [
        {
          label: 'Logins',
          data: stats.activityHistory.map((item) => item.logins),
          backgroundColor: '#9bfb5b',
          borderColor: '#9bfb5b',
          borderWidth: 1
        },
        {
          label: 'Logouts',
          data: stats.activityHistory.map((item) => item.logouts),
          backgroundColor: '#9c9fff',
          borderColor: '#9c9fff',
          borderWidth: 1
        },
        {
          label: 'Boss Kills',
          data: stats.activityHistory.map((item) => item.bossKills),
          backgroundColor: '#ff5f5f',
          borderColor: '#ff5f5f',
          borderWidth: 1
        },
        {
          label: 'Captures',
          data: stats.activityHistory.map((item) => item.captures),
          backgroundColor: '#ffd15a',
          borderColor: '#ffd15a',
          borderWidth: 1
        }
      ]
    };
  }, [stats]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Statistics</h2>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorBanner message={error} onRetry={load} />
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <GlassPanel>
              <p className="text-sm text-slate-300">Total players registered</p>
              <p className="text-2xl font-bold text-white">{stats.totalPlayers}</p>
            </GlassPanel>
            <GlassPanel>
              <p className="text-sm text-slate-300">Total guilds</p>
              <p className="text-2xl font-bold text-white">{stats.totalGuilds}</p>
            </GlassPanel>
            <GlassPanel>
              <p className="text-sm text-slate-300">Total captures</p>
              <p className="text-2xl font-bold text-white">{stats.totalCaptures}</p>
            </GlassPanel>
            <GlassPanel>
              <p className="text-sm text-slate-300">Total boss kills</p>
              <p className="text-2xl font-bold text-white">{stats.totalBossKills}</p>
            </GlassPanel>
            <GlassPanel>
              <p className="text-sm text-slate-300">Total playtime</p>
              <p className="text-2xl font-bold text-white">{stats.totalPlayTime} hrs</p>
            </GlassPanel>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <GlassPanel className="min-h-[320px]">
              <h3 className="mb-3 font-semibold text-neonBlue">Historical Player Count</h3>
              {playerCountData ? <Line data={playerCountData} options={{ responsive: true, maintainAspectRatio: false }} /> : null}
            </GlassPanel>
            <GlassPanel className="min-h-[320px]">
              <h3 className="mb-3 font-semibold text-neonBlue">Historical Activity</h3>
              {activityData ? <Bar data={activityData} options={{ responsive: true, maintainAspectRatio: false }} /> : null}
            </GlassPanel>
          </div>
        </>
      ) : null}
    </section>
  );
}
