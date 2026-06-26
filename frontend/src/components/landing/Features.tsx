const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    title: "Task Management",
    desc: "Organize tasks with priorities, deadlines, and smart categorization. Stay on top of everything.",
    status: "Coming in v0.2",
    color: "text-emerald-400",
    glow: "bg-emerald-400/10",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
    title: "Goals & Projects",
    desc: "Break big objectives into milestones. Track progress across projects and long-term goals.",
    status: "Coming in v0.3",
    color: "text-violet-400",
    glow: "bg-violet-400/10",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "Smart Planning",
    desc: "Plan your day intelligently based on priorities, energy levels, and available time.",
    status: "Coming in v0.4",
    color: "text-amber-400",
    glow: "bg-amber-400/10",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Analytics",
    desc: "Understand your productivity patterns. Visualize trends and optimize your workflow.",
    status: "Coming in v0.5",
    color: "text-rose-400",
    glow: "bg-rose-400/10",
  },
];

export function Features() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="section-divider mx-auto max-w-2xl mb-24" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="gradient-text">execute with clarity</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            A unified platform designed to bring structure to your daily workflow.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((f) => (
            <div key={f.title} className="card-elevated p-6 group">
              <div className="flex items-start gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${f.glow} ${f.color} transition-all duration-300 group-hover:scale-110`}>
                  {f.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold">{f.title}</h3>
                    <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-hover">{f.status}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
