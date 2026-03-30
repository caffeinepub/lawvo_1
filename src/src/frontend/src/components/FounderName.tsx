export function FounderName({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-bold text-gold inline-flex items-center gap-1 ${className}`}
      style={{ color: "oklch(var(--gold))" }}
    >
      Tarun Kumar
    </span>
  );
}
