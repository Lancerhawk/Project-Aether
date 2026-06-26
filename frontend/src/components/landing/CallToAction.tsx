import Link from "next/link";

export function CallToAction() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="section-divider mx-auto max-w-2xl mb-24" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to take control of your{" "}
            <span className="gradient-text">productivity?</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Start with the foundation. Build your workflow as Aether grows.
          </p>
          <div className="mt-12">
            <Link href="/dashboard" className="btn-primary group inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white">
              Explore Dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
