import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <section
      className={`rounded-3xl border border-white/10 bg-slate-900/55 p-4 backdrop-blur-md shadow-[0_12px_30px_rgba(16,20,40,0.45)] transition-transform duration-300 hover:scale-[1.01] hover:border-neonBlue/40 ${className}`}
    >
      {children}
    </section>
  );
}
