import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

const NAV_LINKS = [
  { to: '/', label: 'Home Dashboard' },
  { to: '/players', label: 'Player Page' },
  { to: '/statistics', label: 'Statistics' },
  { to: '/leaderboards', label: 'Leaderboards' },
  { to: '/world-map', label: 'Interactive World Map' },
  { to: '/activity', label: 'Activity Feed' },
  { to: '/server-info', label: 'Server Information' }
];

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-5 animate-floaty rounded-[2rem] border border-white/10 bg-slate-900/45 p-6 backdrop-blur-md">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-neonGold">Palworld Community Ops</p>
              <h1 className="mt-2 text-3xl font-black tracking-[0.03em] text-neonBlue md:text-4xl">
                pals.chadfi.com Dashboard
              </h1>
            </div>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-neonBlue/60 bg-neonBlue/10 px-4 py-2 text-sm font-medium text-neonBlue transition hover:bg-neonBlue/25"
            >
              Discord Invite
            </a>
          </div>
          <nav className="overflow-x-auto">
            <ul className="flex min-w-max gap-3 py-1">
              {NAV_LINKS.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`inline-block rounded-full px-4 py-2 text-sm transition ${
                        active
                          ? 'bg-neonBlue text-slate-950'
                          : 'border border-white/15 text-slate-200 hover:border-neonBlue/80 hover:text-neonBlue'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>
        <main className="pb-8">{children}</main>
      </div>
    </div>
  );
}
