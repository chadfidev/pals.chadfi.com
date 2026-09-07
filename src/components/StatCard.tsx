import { ReactNode } from 'react';
import { GlassPanel } from './GlassPanel';

interface StatCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
}

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <GlassPanel className="h-full">
      <p className="text-sm uppercase tracking-[0.18em] text-cyan-200/90">{title}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-300">{subtitle}</p> : null}
    </GlassPanel>
  );
}
