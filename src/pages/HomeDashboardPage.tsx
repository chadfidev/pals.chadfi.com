import { useCallback, useEffect, useState } from 'react';
import { GlassPanel } from '../components/GlassPanel';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { StatCard } from '../components/StatCard';
import { dashboardApi } from '../services/dashboardService';
import { DashboardStats, PlayerRecord, ServerInfo, ServerStatus } from '../types/dashboard';

interface HomeState {
  status: ServerStatus | null;
  players: PlayerRecord[];
  metrics: DashboardStats | null;
  serverInfo: ServerInfo | null;
}

const initialState: HomeState = {
  status: null,
  players: [],
  metrics: null,
  serverInfo: null
};

const FlyerPanel = () => {
  const [missing, setMissing] = useState(false);

  return (
    <GlassPanel className="overflow-hidden">
      <h3 className="text-lg font-semibold text-neonBlue">Palworld Flyer</h3>
      <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-2">
        {missing ? (
          <p className="text-sm text-slate-300">Flyer not found.</p>
        ) : (
          <img
            src="/palworld-flyer.png"
            alt="Chadfi Palworld flyer"
            className="h-auto w-full rounded-2xl border border-white/10 object-contain"
            loading="lazy"
            onError={() => setMissing(true)}
          />
        )}
      </div>
    </GlassPanel>
  );
};

const formatMetricsRow = (label: string, value: unknown, fallback = '—') => (
  <p key={label} className="flex items-center justify-between border-b border-white/10 py-2 text-sm">
    <span className="text-slate-300">{label}</span>
    <span className="font-medium text-white">{value === null || value === undefined || value === '' ? fallback : String(value)}</span>
  </p>
);

export function HomeDashboardPage() {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [status, players, metrics, serverInfo] = await Promise.all([
        dashboardApi.getStatus(),
        dashboardApi.getPlayers(),
        dashboardApi.getStats(),
        dashboardApi.getServerInfo()
      ]);

      setState({ status, players, metrics, serverInfo });
    } catch (err) {
      setError((err as Error).message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5 animate-[fadeIn_0.35s_ease-out]">
      <h2 className="text-xl font-semibold">Live Server Overview</h2>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorBanner message={error} onRetry={load} />
      ) : state.status && state.metrics && state.serverInfo ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Server Status" value={
              <span className={`text-2xl ${state.status.online ? 'text-emerald-300' : 'text-red-400'}`}>
                {state.status.online ? 'Online' : 'Offline'}
              </span>
            } subtitle={state.status.lastUpdated} />
            <StatCard title="Connected Players" value={`${state.status.currentPlayers} / ${state.status.maxPlayers}`} subtitle="Live count" />
            <StatCard title="Current FPS" value={`${state.metrics.fps || state.metrics.frameRate}`} subtitle="Frame output from /v1/api/metrics" />
            <StatCard title="Version / Uptime" value={state.status.version} subtitle={state.metrics.uptime} />
          </section>

          <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
            <div className="order-2 grid gap-4 lg:grid-cols-2 xl:order-1">
              <GlassPanel>
                <h3 className="text-lg font-semibold text-neonBlue">Server Identity</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  {formatMetricsRow('Server', state.serverInfo.serverName)}
                  {formatMetricsRow('Description', state.serverInfo.description)}
                  {formatMetricsRow('Version', state.serverInfo.version)}
                  {formatMetricsRow('World GUID', state.serverInfo.worldGuid || 'Not exposed')} 
                  {formatMetricsRow('Join Host', state.status.serverIp)}
                  {formatMetricsRow('How to join', state.status.connectInstructions)}
                </div>
              </GlassPanel>

              <GlassPanel>
                <h3 className="text-lg font-semibold text-neonBlue">Live Metrics</h3>
                <div className="mt-3 text-sm text-slate-200">
                  {formatMetricsRow('FPS', state.metrics.fps)}
                  {formatMetricsRow('Frame Rate', state.metrics.frameRate)}
                  {formatMetricsRow('Players (current)', state.metrics.playersCurrent)}
                  {formatMetricsRow('Players (max)', state.metrics.playersMax)}
                  {formatMetricsRow('Ping', state.metrics.ping ? `${state.metrics.ping} ms` : '—')}
                  {formatMetricsRow('Tick Rate', state.metrics.tickRate)}
                </div>
              </GlassPanel>
            </div>

            <div className="order-1 xl:order-2">
              <FlyerPanel />
            </div>
          </section>

          <section className="grid gap-4">
            <GlassPanel>
              <h3 className="text-lg font-semibold text-neonGold">Player List ({state.players.length})</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm text-left">
                  <thead>
                    <tr className="border-b border-white/20 text-slate-300">
                      <th className="pb-2 pr-4 font-normal">Player</th>
                      <th className="pb-2 pr-4 font-normal">Steam ID</th>
                      <th className="pb-2 pr-4 font-normal">Level</th>
                      <th className="pb-2 pr-4 font-normal">Ping</th>
                      <th className="pb-2 pr-4 font-normal">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.players.length ? (
                      state.players.map((player) => (
                        <tr key={player.id} className="border-b border-white/10">
                          <td className="py-2 pr-4 text-white">{player.name}</td>
                          <td className="py-2 pr-4 text-slate-200">{player.steamId || '—'}</td>
                          <td className="py-2 pr-4 text-slate-200">{player.level ?? '—'}</td>
                          <td className="py-2 pr-4 text-slate-200">{player.ping !== undefined ? `${player.ping} ms` : '—'}</td>
                          <td className="py-2 pr-4 text-slate-200">{player.ip || '—'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-4 text-slate-300" colSpan={5}>
                          No players currently connected.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </GlassPanel>
          </section>

          <section className="grid gap-4">
            <GlassPanel>
              <h3 className="text-lg font-semibold text-neonBlue">Server Settings</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {state.serverInfo.infoRows.map((item) => (
                  <p key={item} className="rounded-xl border border-white/10 bg-slate-950/35 p-2 text-sm text-slate-200">
                    {item}
                  </p>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-100">Active Settings</p>
                <div className="mt-2 max-h-[260px] overflow-auto rounded-xl border border-white/10 bg-slate-950/20 p-3">
                  {state.serverInfo.settings.length ? (
                    <ul className="space-y-2 text-sm text-slate-200">
                      {state.serverInfo.settings.map((entry) => (
                        <li key={`${entry.key}-${entry.value}`} className="flex items-start justify-between gap-6 border-b border-white/10 pb-2">
                          <span className="text-slate-300">{entry.key}</span>
                          <span className="text-right text-white">{entry.value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-300">No structured settings were returned.</p>
                  )}
                </div>
              </div>
            </GlassPanel>
          </section>
        </>
      ) : null}
    </div>
  );
}
