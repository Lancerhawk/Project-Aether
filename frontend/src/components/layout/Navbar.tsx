"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 transition-all duration-300 group-hover:bg-accent/20 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-hover">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Aether</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">Home</Link>
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">Dashboard</Link>
          </div>

          <div className="hidden md:block">
            {isAuthenticated ? (
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full border border-border transition-transform hover:scale-105">
                  {user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-light text-xs font-bold text-text-muted">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <Link href="/login" className="btn-primary rounded-lg px-4 py-2 text-sm font-medium text-white">
                Log in
              </Link>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden rounded-lg p-2 text-text-secondary hover:bg-surface-hover" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border pb-4 pt-3 flex flex-col gap-1">
            <Link href="/" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover">Home</Link>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover">Dashboard</Link>
            <Link href={isAuthenticated ? "/dashboard" : "/login"} onClick={() => setOpen(false)} className="btn-primary mt-3 rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white">
              {isAuthenticated ? "Go to Dashboard" : "Log in"}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
