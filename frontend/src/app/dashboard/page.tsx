import Link from "next/link";

const sidebarLinks = [
  { label: "Overview", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>, active: true },
  { label: "Tasks", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg> },
  { label: "Projects", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg> },
  { label: "Analytics", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
];

const stats = [
  { label: "Tasks Today", value: "—", color: "text-accent-hover" },
  { label: "In Progress", value: "—", color: "text-amber-400" },
  { label: "Completed", value: "—", color: "text-emerald-400" },
  { label: "Streak", value: "—", color: "text-violet-400" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen pt-16">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-surface/50 p-4">
        <div className="mb-6 px-3 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Navigation</h2>
        </div>
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => (
            <button key={link.label} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${link.active ? "bg-accent/10 text-accent-hover" : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"}`}>
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 p-6 sm:p-8 lg:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">Welcome to Aether. Your command center is being built.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="card-elevated p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{s.label}</p>
              <p className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 card-elevated p-6">
            <h3 className="text-sm font-semibold mb-4">Today&apos;s Plan</h3>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-hover">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="text-sm font-medium">No tasks planned yet</p>
              <p className="mt-1 text-xs text-text-muted">The planning engine will be available in a future release.</p>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              {["Create Task", "Start Focus", "Plan Tomorrow"].map((action) => (
                <button key={action} className="btn-secondary flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-text-secondary" disabled>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {action}
                  <span className="ml-auto text-xs text-text-muted">Soon</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 card-elevated p-6">
          <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-text-muted">Activity tracking will appear here in future versions.</p>
            <Link href="/" className="mt-3 text-sm text-accent-hover hover:text-accent transition-colors">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
