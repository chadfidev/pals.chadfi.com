import { useCallback, useEffect, useMemo, useState } from 'react';
import { GlassPanel } from '../components/GlassPanel';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { dashboardApi } from '../services/dashboardService';
import { PlayerRecord } from '../types/dashboard';

type SortField = 'name' | 'characterLevel' | 'guild' | 'playtimeHours';
type SortDirection = 'asc' | 'desc';

export function PlayersPage() {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('characterLevel');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getPlayers();
      setPlayers(data);
    } catch (err) {
      setError((err as Error).message || 'Unable to load player list.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = players;
    if (q) {
      result = players.filter(
        (player) => player.name.toLowerCase().includes(q) || player.guild.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [query, players, sortDirection, sortField]);

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Player Page</h2>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorBanner message={error} onRetry={load} />
      ) : (
        <GlassPanel>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300">Current players online: {filtered.length}</p>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or guild"
              className="w-full rounded-full border border-white/20 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-400 sm:w-80"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/15 text-slate-300">
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'characterLevel', label: 'Character Level' },
                    { key: 'guild', label: 'Guild' },
                    { key: 'playtimeHours', label: 'Playtime (hrs)' },
                    { key: 'palsCaptured', label: 'Pals Captured' },
                    { key: 'richestPlayers', label: 'Richest' }
                  ].map((item) => (
                    <th
                      key={item.key}
                      className="whitespace-nowrap px-3 py-2"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            item.key === 'name' ||
                            item.key === 'characterLevel' ||
                            item.key === 'guild' ||
                            item.key === 'playtimeHours'
                          ) {
                            toggleSort(item.key);
                          }
                        }}
                        className="inline-flex items-center gap-1"
                      >
                        {item.label}
                        {sortField === item.key ? <span className="text-xs uppercase text-neonBlue">({sortDirection})</span> : null}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((player) => (
                  <tr key={player.id} className="border-b border-white/10 last:border-b-0">
                    <td className="px-3 py-2">{player.name}</td>
                    <td className="px-3 py-2">{player.characterLevel}</td>
                    <td className="px-3 py-2">{player.guild}</td>
                    <td className="px-3 py-2">{player.playtimeHours}</td>
                    <td className="px-3 py-2">{player.palsCaptured}</td>
                    <td className="px-3 py-2">{player.richestPlayers.toLocaleString()} G</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}
    </section>
  );
}
