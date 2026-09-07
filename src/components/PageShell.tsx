import { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <header className="space-y-5 animate-floaty rounded-[2rem] border border-white/10 bg-slate-900/45 p-6 backdrop-blur-md">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-neonGold">Palworld Community Ops</p>
              <h1 className="mt-2 text-3xl font-black tracking-[0.03em] text-neonBlue md:text-4xl">
                Chadfi Palworld Server Info
              </h1>
            </div>
          </div>
        </header>
        <main className="pb-8">{children}</main>
      </div>
    </div>
  );
}
