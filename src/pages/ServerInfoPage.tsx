import { useCallback, useEffect, useState } from 'react';
import { GlassPanel } from '../components/GlassPanel';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { dashboardApi } from '../services/dashboardService';
import { ServerInfo } from '../types/dashboard';

export function ServerInfoPage() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getServerInfo();
      setServerInfo(data);
    } catch (err) {
      setError((err as Error).message || 'Unable to load server information.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Server Information</h2>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorBanner message={error} onRetry={load} />
      ) : serverInfo ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <GlassPanel>
              <h3 className="text-lg font-semibold text-neonBlue">Rules</h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-200">
                {serverInfo.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </GlassPanel>
            <GlassPanel>
              <h3 className="text-lg font-semibold text-neonBlue">Mods</h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-200">
                {serverInfo.mods.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </GlassPanel>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <GlassPanel>
              <h3 className="text-lg font-semibold text-neonGold">Restart Schedule</h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-200">
                {serverInfo.restartSchedule.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </GlassPanel>
            <GlassPanel>
              <h3 className="text-lg font-semibold text-neonGold">Backup Schedule</h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-200">
                {serverInfo.backupSchedule.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </GlassPanel>
          </div>

          <GlassPanel>
            <h3 className="text-lg font-semibold text-neonBlue">FAQ</h3>
            <div className="mt-3 space-y-2 text-sm">
              {serverInfo.faq.map((item) => (
                <details key={item.question} className="rounded-lg border border-white/15 p-3">
                  <summary className="cursor-pointer">{item.question}</summary>
                  <p className="mt-2 text-slate-200">{item.answer}</p>
                </details>
              ))}
            </div>
          </GlassPanel>
        </>
      ) : null}
    </section>
  );
}
