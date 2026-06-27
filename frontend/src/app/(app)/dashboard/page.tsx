"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const stats = [
  { label: "Tasks Today", value: "0", color: "text-accent-hover" },
  { label: "In Progress", value: "0", color: "text-amber-400" },
  { label: "Completed", value: "0", color: "text-emerald-400" },
  { label: "Streak", value: "0", color: "text-violet-400" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Good morning, {user?.name || "there"}</h1>
        <p className="mt-1 text-sm text-text-secondary">Welcome to Aether. Your command center is ready.</p>
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
        </div>
      </div>
    </div>
  );
}
