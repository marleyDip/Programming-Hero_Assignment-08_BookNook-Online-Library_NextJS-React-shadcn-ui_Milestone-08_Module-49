/** server component, no JS needed */

function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-muted ${className}`} />;
}

export default function AuthSkeleton({
  fields = 2,
  rules = false,
}: {
  fields?: number;
  rules?: boolean;
}) {
  return (
    <div
      className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12"
      role="status"
      aria-label="Loading"
    >
      <div className="grid overflow-hidden rounded-4xl border border-border/70 bg-card shadow-2xl shadow-emerald-900/10 lg:grid-cols-[1fr_1.05fr]">
        {/* brand panel */}
        <div className="hidden flex-col justify-between bg-linear-to-br from-emerald-950 via-[#0b3b32] to-teal-800 p-10 lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="size-9 animate-pulse rounded-xl bg-white/15" />
            <div className="h-4 w-24 animate-pulse rounded-full bg-white/15" />
          </div>

          <div className="space-y-3">
            <div className="h-8 w-64 animate-pulse rounded-full bg-white/15" />
            <div className="h-8 w-48 animate-pulse rounded-full bg-white/15" />
            <div className="mt-5 h-3.5 w-72 animate-pulse rounded-full bg-white/10" />
            <div className="h-3.5 w-56 animate-pulse rounded-full bg-white/10" />
          </div>

          <div className="mx-auto flex gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-36 w-24 animate-pulse rounded-lg bg-white/10"
              />
            ))}
          </div>
        </div>

        {/* form side */}
        <div className="p-6 sm:p-10 lg:p-12">
          <Bar className="h-9 w-56" />
          <Bar className="mt-4 h-4 w-72 max-w-full" />

          <div className="mt-8 space-y-5">
            {Array.from({ length: fields }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Bar className="h-3.5 w-20" />
                <div className="h-12 animate-pulse rounded-xl bg-muted" />
              </div>
            ))}

            {rules && (
              <div className="h-20 animate-pulse rounded-xl bg-muted" />
            )}

            <div className="h-12 animate-pulse rounded-xl bg-emerald-500/30" />
          </div>

          <div className="mt-6 space-y-6">
            <Bar className="mx-auto h-3 w-full" />
            <div className="h-12 animate-pulse rounded-xl bg-muted" />
          </div>

          <Bar className="mx-auto mt-8 h-4 w-52" />
        </div>
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
}
