import { PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GlassPanel } from '../components/GlassPanel';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { dashboardApi } from '../services/dashboardService';
import { MapData, MapFeatureType } from '../types/dashboard';

const typeColor: Record<MapFeatureType, string> = {
  base: 'bg-neonGold shadow-neonGold/60',
  boss: 'bg-red-500 shadow-red-500/60',
  resource: 'bg-emerald-400 shadow-emerald-400/60',
  tower: 'bg-neonBlue shadow-neonBlue/60'
};

const typeLabel: Record<MapFeatureType, string> = {
  base: 'Player Base',
  tower: 'Fast Travel Tower',
  boss: 'Boss',
  resource: 'Resource Point'
};

export function MapPage() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ x: 0, y: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getMapData();
      setMapData(data);
    } catch (err) {
      setError((err as Error).message || 'Unable to load map data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markers = useMemo(() => {
    if (!mapData) return [];
    const query = searchTerm.trim().toLowerCase();
    return mapData.features.filter((feature) => {
      if (!query) return true;
      return (
        feature.name.toLowerCase().includes(query) ||
        feature.type.toLowerCase().includes(query) ||
        feature.description.toLowerCase().includes(query)
      );
    });
  }, [mapData, searchTerm]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    dragOrigin.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setOffset({ x: event.clientX - dragOrigin.current.x, y: event.clientY - dragOrigin.current.y });
  };

  const onPointerUp = () => setDragging(false);

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.08 : 0.93;
    setScale((current) => {
      const next = Math.min(2.8, Math.max(0.8, current * factor));
      return next;
    });
  };

  const zoomIn = () => setScale((current) => Math.min(2.8, current * 1.1));
  const zoomOut = () => setScale((current) => Math.max(0.8, current / 1.1));
  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Interactive World Map</h2>
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorBanner message={error} onRetry={load} />
      ) : mapData ? (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
            <GlassPanel className="p-0">
              <div className="flex flex-wrap items-center gap-3 border-b border-white/10 bg-slate-900/40 px-4 py-3">
                <input
                  type="search"
                  placeholder="Search bases, towers, bosses, resources..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-full border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400 sm:w-96"
                />
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={zoomIn} type="button" className="rounded-full border border-white/25 px-3 py-1 text-xs">
                    Zoom +
                  </button>
                  <button onClick={zoomOut} type="button" className="rounded-full border border-white/25 px-3 py-1 text-xs">
                    Zoom -
                  </button>
                  <button onClick={resetView} type="button" className="rounded-full border border-white/25 px-3 py-1 text-xs">
                    Reset
                  </button>
                </div>
              </div>

              <div
                className="relative h-[68vh] w-full overflow-hidden"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                onWheel={onWheel}
              >
                <div
                  className="absolute inset-0 h-[140%] w-[180%] rounded-2xl"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    backgroundImage:
                      'radial-gradient(circle at 20% 20%, rgba(72,199,255,0.14), transparent 38%), radial-gradient(circle at 70% 62%, rgba(255,209,90,0.12), transparent 36%), linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
                    backgroundSize: '100% 100%, 100% 100%, 52px 52px, 52px 52px',
                    backgroundColor: '#07101d'
                  }}
                >
                  {mapData.features.map((feature) => (
                    <button
                      type="button"
                      key={feature.id}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 ${typeColor[feature.type]} h-4 w-4 shadow-lg`}
                      style={{ left: `${feature.x}%`, top: `${feature.y}%` }}
                      title={feature.name}
                    >
                      <span className="sr-only">{feature.name}</span>
                    </button>
                  ))}

                  {markers.map((feature) => (
                    <div
                      key={`label-${feature.id}`}
                      className="absolute max-w-[220px] rounded-xl border border-white/25 bg-slate-950/80 p-2 text-xs backdrop-blur"
                      style={{
                        left: `calc(${feature.x}% + 12px)`,
                        top: `calc(${feature.y}% - 8px)`,
                        transform: `scale(${1 / Math.max(scale, 0.8)})`
                      }}
                    >
                      <p className="font-semibold text-neonBlue">{feature.name}</p>
                      <p className="text-slate-300">{typeLabel[feature.type]}</p>
                      <p className="text-slate-400">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>

            <GlassPanel>
              <h3 className="text-lg font-semibold text-neonBlue">Layer Controls</h3>
              <ul className="mt-3 space-y-3 text-sm">
                {(['base', 'tower', 'boss', 'resource'] as MapFeatureType[]).map((type) => (
                  <li key={type} className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span>{typeLabel[type]}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${typeColor[type]}`} />
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-2 text-sm">
                <p className="text-slate-300">Total markers: {markers.length}</p>
                <p className="text-slate-400">
                  Use mouse wheel to zoom, drag to pan, and search for a base or resource to filter markers.
                </p>
              </div>
            </GlassPanel>
          </div>
        </>
      ) : null}
    </section>
  );
}
