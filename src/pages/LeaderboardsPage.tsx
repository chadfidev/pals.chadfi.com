import { useCallback, useEffect, useState } from 'react';
import { GlassPanel } from '../components/GlassPanel';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { dashboardApi } from '../services/dashboardService';
import { Leaderboards } from '../types/dashboard';

type Category = 'highestLevel' | 'mostPlaytime' | 'mostPalsCaptured' | 'richestPlayers' | 'largestGuilds';

const categoryLabels: Record<Category, string> = {
  highestLevel: 'Highest Level Players',
  mostPlaytime: 'Most Playtime',
  mostPalsCaptured: 'Most Pals Captured',
  richestPlayers: 'Richest Players',
  largestGuilds: 'Largest Guilds'
};

export function LeaderboardsPage() {
  const [leaderboards, setLeaderboards] = useState<Leaderboards | null>(null);
  const [category, setCategory] = useState<Category>('highestLevel');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getLeaderboards();
      setLeaderboards(data);
    } catch (err) {
      setError((err as Error).message || 'Unable to load leaderboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const rows = leaderboards ? leaderboards[category] : [];
  const metricLabel = category === 'mostPlaytime' ? 'hours' : 'value';

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Leaderboards</h2>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorBanner message={error} onRetry={load} />
      ) : leaderboards ? (
        <>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(categoryLabels) as Category[]).map((key) => (
              <button
                type="button"
                key={key}
                onClick={() => setCategory(key)}
                className={`rounded-full border px-3 py-2 text-xs ${
                  category === key
                    ? 'border-neonGold bg-neonGold/20 text-neonGold'
                    : 'border-white/25 text-slate-200'
                }`}
              >
                {categoryLabels[key]}
              </button>
            ))}
          </div>
          <GlassPanel>
            <h3 className="mb-3 text-lg font-semibold text-neonGold">{categoryLabels[category]}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/15 text-slate-300">
                    <th className="px-3 py-2">Rank</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Value</th>
                    <th className="px-3 py-2">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={`${category}-${row.name}`} className="border-b border-white/10 last:border-0">
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">{row.name}</td>
                      <td className="px-3 py-2">
                        {row.value.toLocaleString()} {metricLabel}
                      </td>
                      <td className="px-3 py-2">{row.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </>
      ) : null}
    </section>
  );
}
