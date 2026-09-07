import { EventType } from '../types/dashboard';

const colors: Record<EventType, string> = {
  login: 'from-emerald-300 to-emerald-500',
  logout: 'from-amber-300 to-orange-500',
  'boss-kill': 'from-red-300 to-rose-500',
  capture: 'from-sky-300 to-neonBlue',
  'guild-event': 'from-violet-300 to-fuchsia-500',
  'server-restart': 'from-slate-300 to-slate-500'
};

export function EventRow({ type, player, details, timestamp }: { type: EventType; player?: string; details: string; timestamp: string }) {
  const badge = type.replace('-', ' ');
  return (
    <li className="rounded-2xl border border-white/10 bg-slate-900/40 p-3">
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-3 w-3 flex-none rounded-full bg-gradient-to-br ${colors[type]}`} />
        <div className="min-w-0">
          <p className="text-sm text-white">
            <span className="mr-2 rounded-full border border-white/20 px-2 py-0.5 text-[11px] uppercase tracking-[0.13em]">
              {badge}
            </span>
            <span className="text-slate-300">{player ? `${player} ` : ''}</span>
            {details}
          </p>
          <p className="mt-1 text-xs text-slate-400">{timestamp}</p>
        </div>
      </div>
    </li>
  );
}
