/**
 * Place at: src/app/loading.tsx   (global loading UI, 3D version)
 * Pure CSS 3D animation: a book on a glowing platform turning its pages
 * while book covers orbit around it. Server component, no extra packages.
 */

const COVERS = [
  { angle: 0, color: "linear-gradient(135deg,#6ee7b7,#059669)" },
  { angle: 90, color: "linear-gradient(135deg,#fde68a,#f59e0b)" },
  { angle: 180, color: "linear-gradient(135deg,#bae6fd,#0ea5e9)" },
  { angle: 270, color: "linear-gradient(135deg,#fecdd3,#f43f5e)" },
];

const PAGES = [0, 1, 2, 3, 4];

const PAPER =
  "linear-gradient(to right,#e7e5e4,#fafaf9 18%,#ffffff), repeating-linear-gradient(to bottom,transparent 0 11px,rgba(16,185,129,.16) 11px 12px)";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative isolate flex min-h-[70vh] flex-col items-center justify-center gap-10 overflow-hidden px-4 py-10"
    >
      <style>{`
        .bn3d { transform-style: preserve-3d; }
        @keyframes bn-sway {
          0%   { transform: rotateX(62deg) rotateZ(-36deg); }
          100% { transform: rotateX(56deg) rotateZ(-12deg); }
        }
        @keyframes bn-orbit { to { transform: rotateZ(360deg); } }
        @keyframes bn-flip {
          0%, 8%    { transform: translateZ(var(--z)) rotateY(0deg); }
          42%, 58%  { transform: translateZ(var(--z)) rotateY(-179deg); }
          92%, 100% { transform: translateZ(var(--z)) rotateY(0deg); }
        }
        @keyframes bn-shade {
          0%, 8%, 42%, 58%, 92%, 100% { opacity: 0; }
          25%, 75%                    { opacity: .55; }
        }
        @keyframes bn-bob {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(12px); }
        }
        @keyframes bn-ripple {
          0%   { transform: scale(.35); opacity: .7; }
          100% { transform: scale(1.25); opacity: 0; }
        }
        @keyframes bn-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes bn-shimmer { to { background-position: -200% 0; } }
        @keyframes bn-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: .35; }
          40%           { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes bn-bar { 0% { transform: translateX(-110%); } 100% { transform: translateX(300%); } }
        @media (prefers-reduced-motion: reduce) {
          .bn-anim, .bn-anim * { animation: none !important; }
        }
      `}</style>

      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-[38%] -z-10 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="pointer-events-none absolute left-[62%] top-[30%] -z-10 size-56 rounded-full bg-amber-300/10 blur-3xl" />

      {/* 3D scene */}
      <div
        className="bn-anim scale-[0.82] sm:scale-100"
        style={{ animation: "bn-float 4s ease-in-out infinite" }}
      >
        <div className="relative h-80 w-80" style={{ perspective: "1100px" }}>
          {/* stage: a tilted, slowly swaying floor */}
          <div
            className="bn3d bn-anim absolute inset-0"
            style={{
              animation: "bn-sway 6s ease-in-out infinite alternate",
              transform: "rotateX(62deg) rotateZ(-30deg)",
            }}
          >
            {/* platform disc */}
            <div
              className="absolute left-1/2 top-1/2 size-68 rounded-full border border-emerald-300/30"
              style={{
                marginLeft: "-8.5rem",
                marginTop: "-8.5rem",
                background:
                  "radial-gradient(circle, rgba(16,185,129,.45) 0%, rgba(13,148,136,.18) 48%, rgba(13,148,136,0) 70%)",
                boxShadow:
                  "0 0 60px rgba(16,185,129,.35), inset 0 0 40px rgba(16,185,129,.25)",
              }}
            />

            {/* ripples */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bn-anim absolute left-1/2 top-1/2 size-68 rounded-full border border-emerald-300/50"
                style={{
                  marginLeft: "-8.5rem",
                  marginTop: "-8.5rem",
                  animation: `bn-ripple 3.6s ${i * 1.2}s ease-out infinite`,
                }}
              />
            ))}

            {/* dashed orbit track */}
            <div
              className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/20"
              style={{
                width: 256,
                height: 256,
                marginLeft: -128,
                marginTop: -128,
              }}
            />

            {/* the book */}
            <div className="bn3d absolute inset-0">
              {/* soft contact shadow */}
              <div
                className="absolute left-1/2 top-1/2 rounded-[18px] bg-black/50 blur-xl"
                style={{
                  width: 186,
                  height: 128,
                  marginLeft: -93,
                  marginTop: -64,
                  transform: "translateZ(1px)",
                }}
              />

              {/* cover slab */}
              <div
                className="absolute left-1/2 top-1/2 rounded-xl"
                style={{
                  width: 176,
                  height: 120,
                  marginLeft: -88,
                  marginTop: -60,
                  transform: "translateZ(5px)",
                  background: "linear-gradient(135deg,#10b981,#0f766e)",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,.25), 0 8px 24px rgba(0,0,0,.35)",
                }}
              />

              {/* left page (static) */}
              <div
                className="absolute left-1/2 top-1/2 rounded-l-md"
                style={{
                  width: 80,
                  height: 104,
                  marginLeft: -82,
                  marginTop: -52,
                  transform: "translateZ(9px)",
                  background: PAPER,
                  transformOrigin: "right center",
                }}
              />

              {/* right page (static, under the flippers) */}
              <div
                className="absolute left-1/2 top-1/2 rounded-r-md"
                style={{
                  width: 80,
                  height: 104,
                  marginLeft: 2,
                  marginTop: -52,
                  transform: "translateZ(9px)",
                  background: PAPER,
                }}
              />

              {/* spine */}
              <div
                className="absolute left-1/2 top-1/2 bg-emerald-950/50"
                style={{
                  width: 4,
                  height: 108,
                  marginLeft: -2,
                  marginTop: -54,
                  transform: "translateZ(10px)",
                }}
              />

              {/* flipping pages */}
              {PAGES.map((i) => (
                <div
                  key={i}
                  className="bn3d bn-anim absolute left-1/2 top-1/2"
                  style={
                    {
                      width: 80,
                      height: 104,
                      marginLeft: 2,
                      marginTop: -52,
                      transformOrigin: "left center",
                      "--z": `${11 + i * 0.6}px`,
                      animation: `bn-flip 3.8s ${i * 0.3}s ease-in-out infinite`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="absolute inset-0 rounded-r-md"
                    style={{ background: PAPER }}
                  />
                  <div
                    className="bn-anim absolute inset-0 rounded-r-md"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(0,0,0,.35), rgba(0,0,0,0))",
                      animation: `bn-shade 3.8s ${i * 0.3}s ease-in-out infinite`,
                    }}
                  />

                  {/* tiny heading bar on each page */}
                  <div className="absolute left-3 top-3 h-1.5 w-8 rounded-full bg-emerald-500/60" />
                </div>
              ))}
            </div>

            {/* orbiting book covers */}
            <div
              className="bn3d bn-anim absolute inset-0"
              style={{ animation: "bn-orbit 14s linear infinite" }}
            >
              {COVERS.map((c) => (
                <div
                  key={c.angle}
                  className="bn3d absolute left-1/2 top-1/2"
                  style={{
                    width: 38,
                    height: 52,
                    marginLeft: -19,
                    marginTop: -26,
                    transform: `rotateZ(${c.angle}deg) translateX(128px) translateZ(34px) rotateY(90deg)`,
                  }}
                >
                  <div
                    className="bn-anim h-full w-full rounded-[3px]"
                    style={{
                      background: c.color,
                      animation: `bn-bob 2.6s ${(c.angle / 90) * 0.4}s ease-in-out infinite`,
                      boxShadow:
                        "0 0 0 1px rgba(255,255,255,.35), 0 0 18px rgba(52,211,153,.45)",
                    }}
                  >
                    <div className="h-full w-1.5 rounded-l-[3px] bg-black/25" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* text */}
      <div className="text-center">
        <p
          className="bn-anim bg-clip-text text-2xl font-semibold tracking-tight text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg,#10b981,#14b8a6,#fbbf24,#14b8a6,#10b981)",
            backgroundSize: "200% 100%",
            animation: "bn-shimmer 3s linear infinite",
          }}
        >
          BookNook
        </p>

        <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          Turning the page
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

      <div
        className="h-1 w-44 overflow-hidden rounded-full bg-muted"
        aria-hidden
      >
        <div
          className="bn-anim h-full w-1/3 rounded-full bg-linear-to-r from-emerald-400 via-teal-400 to-amber-300"
          style={{ animation: "bn-bar 1.5s ease-in-out infinite" }}
        />
      </div>

      <span className="sr-only">Loading</span>
    </div>
  );
}
