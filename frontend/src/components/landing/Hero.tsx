import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[150px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 left-1/4 h-[200px] w-[200px] rounded-full bg-indigo-400/10 blur-[80px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface-light/50 px-4 py-1.5 text-sm text-text-secondary backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            v0.1.0 — Foundation Release
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up-d1 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
            Plan smarter.{" "}
            <span className="gradient-text">Execute better.</span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up-d2 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            Aether is a smart daily planning and execution platform built for students, developers, and project workers who want to achieve more with less friction.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-up-d3 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard" className="btn-primary group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white">
              Open Dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium text-text-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View Source
            </a>
          </div>
        </div>

        {/* Wireframe Preview */}
        <div className="animate-fade-up-d4 mx-auto mt-20 max-w-4xl">
          <div className="card-elevated p-1">
            <div className="rounded-xl bg-surface p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-text-muted font-mono">aether — dashboard</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
                  <div className="h-3 w-48 rounded-sm bg-surface-light" />
                  <div className="ml-auto h-3 w-16 rounded-sm bg-accent/20" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_6px_rgba(99,102,241,0.4)]" />
                  <div className="h-3 w-64 rounded-sm bg-surface-light" />
                  <div className="ml-auto h-3 w-20 rounded-sm bg-yellow-500/20" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-text-muted" />
                  <div className="h-3 w-40 rounded-sm bg-surface-light" />
                  <div className="ml-auto h-3 w-12 rounded-sm bg-surface-light" />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-background/80 border border-border p-3 h-16" />
                  <div className="rounded-lg bg-background/80 border border-border p-3 h-16" />
                  <div className="rounded-lg bg-background/80 border border-border p-3 h-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
