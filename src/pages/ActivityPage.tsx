import { useCallback, useEffect, useMemo, useState } from 'react';
import { EventRow } from '../components/EventRow';
import { GlassPanel } from '../components/GlassPanel';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { dashboardApi } from '../services/dashboardService';
import { EventType, ServerEvent } from '../types/dashboard';

const activityTypes: { value: EventType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'login', label: 'Logins' },
  { value: 'logout', label: 'Logouts' },
  { value: 'boss-kill', label: 'Boss Kills' },
  { value: 'capture', label: 'Captures' },
  { value: 'guild-event', label: 'Guild Events' },
  { value: 'server-restart', label: 'Restarts' }
];

export function ActivityPage() {
  const [events, setEvents] = useState<ServerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<EventType | 'all'>('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getEvents();
      setEvents(data);
    } catch (err) {
      setError((err as Error).message || 'Unable to load activity feed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((event) => {
      const matchesType = filter === 'all' || event.type === filter;
      const matchesSearch =
        !term || `${event.player ?? ''} ${event.details}`.toLowerCase().includes(term);
      return matchesType && matchesSearch;
    });
  }, [events, filter, search]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Activity Feed</h2>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorBanner message={error} onRetry={load} />
      ) : (
        <GlassPanel>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {activityTypes.map((type) => (
                <button
                  key={type.label}
                  type="button"
                  onClick={() => setFilter(type.value)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    filter === type.value
                      ? 'border-neonBlue bg-neonBlue/20 text-neonBlue'
                      : 'border-white/25 text-slate-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search player or message"
              className="w-full rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-400 sm:w-72"
            />
          </div>
          <ul className="space-y-2">
            {filtered.length === 0 ? (
              <li className="text-sm text-slate-300">No activity matching that filter.</li>
            ) : (
              filtered.map((event) => (
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
      )}
    </section>
  );
}
