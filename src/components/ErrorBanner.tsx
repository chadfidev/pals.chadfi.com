interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="rounded-2xl border border-red-400/40 bg-red-900/30 p-4 text-red-200">
      <p className="text-sm font-medium">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-full border border-red-200/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
