"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Link from "next/link";

export function Topbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between lg:justify-end sticky top-0 z-40">
      {/* Mobile brand - only visible on small screens */}
      <div className="lg:hidden flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-hover">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
        </div>
        <span className="font-bold tracking-tight text-sm">Aether</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications (placeholder) */}
        <button className="text-text-secondary hover:text-text-primary transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* User menu */}
        <div className="relative">
          <button 
            className="flex items-center gap-2 pl-2"
            onClick={() => setMenuOpen(!menuOpen)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
          >
            <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-light border border-border transition-transform hover:scale-105">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-text-muted">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface shadow-2xl animate-fade-up origin-top-right overflow-hidden py-1">
              <div className="px-4 py-2 border-b border-border/50 mb-1">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>
              <Link href="/settings" className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary">
                Settings
              </Link>
              <button 
                onClick={logout}
                className="w-full text-left block px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
