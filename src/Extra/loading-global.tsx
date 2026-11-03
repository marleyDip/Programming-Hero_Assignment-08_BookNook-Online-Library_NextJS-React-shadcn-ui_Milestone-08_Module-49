/**
 * Global loading UI
 * Shows inside your layout (between Navbar and Footer) while any page loads.
 * Pure CSS animation, so it is a server component and needs no extra packages.
 */

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative isolate flex min-h-[65vh] flex-col items-center justify-center gap-8 px-4"
    >
      <style>{`
        @keyframes bn-page-flip {
          0%   { transform: rotateY(0deg); }
          45%  { transform: rotateY(-172deg); }
          100% { transform: rotateY(-172deg); }
        }
        @keyframes bn-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: .4; }
          40%           { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes bn-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(260%); }
        }
        @keyframes bn-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bn-anim { animation: none !important; }
        }
      `}</style>

      {/* soft glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-3xl" />

      {/* animated book */}
      <div className="bn-anim animate-[bn-float_3s_ease-in-out_infinite]">
        <div className="relative h-20 w-28 perspective-[700px]">
          {/* covers */}
          <div className="absolute -inset-x-1.5 -inset-y-1 rounded-lg bg-linear-to-br from-emerald-500 to-teal-700 shadow-xl shadow-emerald-900/30" />

          {/* bookmark ribbon */}
          <div className="absolute -top-1 right-5 h-5 w-2 rounded-b-sm bg-amber-300 shadow" />

          {/* spine */}
          <div className="absolute inset-y-0 left-1/2 w-px bg-black/25" />

          {/* left page */}
          <div className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-l-sm bg-neutral-50" />

          {/* flipping pages */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="bn-anim absolute inset-y-1 left-1/2 w-[calc(50%-4px)] origin-left rounded-r-sm border-l border-neutral-200 bg-neutral-50 backface-hidden transform-3d"
              style={{
                animation: `bn-page-flip 2.4s ${i * 0.22}s ease-in-out infinite alternate`,
              }}
            >
              <div className="mx-2 mt-2.5 space-y-1.5">
                <div className="h-0.5 rounded-full bg-neutral-300" />

                <div className="h-0.5 w-4/5 rounded-full bg-neutral-300" />

                <div className="h-0.5 w-3/5 rounded-full bg-neutral-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* text */}
      <div className="text-center">
        <p className="text-lg font-semibold tracking-tight">BookNook</p>

        <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          Opening your shelf
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="bn-anim size-1 rounded-full bg-emerald-500"
                style={{
                  animation: `bn-dot 1.2s ${i * 0.15}s ease-in-out infinite`,
                }}
              />
            ))}
          </span>
        </p>
      </div>

      {/* shimmer bar */}
      <div
        className="h-1 w-40 overflow-hidden rounded-full bg-muted"
        aria-hidden
      >
        <div
          className="bn-anim h-full w-1/3 rounded-full bg-linear-to-r from-emerald-400 to-teal-500"
          style={{ animation: "bn-bar 1.4s ease-in-out infinite" }}
        />
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
}
