export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-20 text-slate"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brass" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
