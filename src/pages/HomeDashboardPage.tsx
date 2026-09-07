import { useCallback, useEffect, useState } from 'react';
import { EventRow } from '../components/EventRow';
import { GlassPanel } from '../components/GlassPanel';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { StatCard } from '../components/StatCard';
import { dashboardApi } from '../services/dashboardService';
import { ServerEvent, ServerStatus } from '../types/dashboard';

interface HomeState {
  status: ServerStatus | null;
  events: ServerEvent[];
}

const initialState: HomeState = { status: null, events: [] };

export function HomeDashboardPage() {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [status, events] = await Promise.all([dashboardApi.getStatus(), dashboardApi.getEvents()]);
      setState({ status, events: events.slice(0, 6) });
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
    <div className="space-y-6 animate-[fadeIn_0.35s_ease-out]">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Home Dashboard</h2>
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorBanner message={error} onRetry={load} />
        ) : state.status ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Server Status"
                value={
                  <span className={`text-2xl ${state.status.online ? 'text-emerald-300' : 'text-red-400'}`}>
                    {state.status.online ? 'Online' : 'Offline'}
                  </span>
                }
                subtitle={state.status.lastUpdated}
              />
              <StatCard
                title="Current Players"
                value={`${state.status.currentPlayers} / ${state.status.maxPlayers}`}
                subtitle="Active connections"
              />
              <StatCard
                title="Server Uptime"
                value={state.status.uptime}
                subtitle="Since last restart"
              />
              <StatCard title="Server Version" value={state.status.version} subtitle="Palworld build tag" />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <GlassPanel>
                <h3 className="text-lg font-semibold text-neonBlue">Connect</h3>
                <p className="mt-3 text-sm text-slate-300">
                  IP: <span className="font-medium text-white">{state.status.serverIp}</span>
                </p>
                <p className="mt-2 text-sm text-slate-300">{state.status.connectInstructions}</p>
              </GlassPanel>
              <GlassPanel>
                <h3 className="text-lg font-semibold text-neonBlue">Recent Activity</h3>
                <ul className="mt-3 space-y-2">
                  {state.events.length === 0 ? (
                    <li className="text-sm text-slate-300">No activity available yet.</li>
                  ) : (
                    state.events.map((event) => (
                      <EventRow
                        key={event.id}
                        type={event.type}
                        player={event.player}
                        details={event.details}
                        timestamp={event.timestamp}
                      />
                    ))
                  )}
                </ul>
              </GlassPanel>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
