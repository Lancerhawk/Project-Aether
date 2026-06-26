import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-hover">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Aether</span>
            <span className="rounded-md bg-surface-light px-2 py-0.5 text-xs text-text-muted">v0.1.0</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-text-muted hover:text-text-secondary transition-colors">Home</Link>
            <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-secondary transition-colors">Dashboard</Link>
          </div>
          <p className="text-sm text-text-muted">&copy; {new Date().getFullYear()} Aether. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
