"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { links } from "@/components/layout/Sidebar";

export function Topbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="h-16 shrink-0 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between lg:justify-end sticky top-0 z-40">
      {/* Mobile brand & hamburger - only visible on small screens */}
      <div className="lg:hidden flex items-center gap-3">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 -ml-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          aria-label="Open mobile menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-hover">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
          </div>
          <span className="font-bold tracking-tight text-sm">Aether</span>
        </div>
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

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 flex ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className={`relative flex w-72 max-w-[80%] flex-col bg-[#0c0c0f] border-r border-border h-full shadow-2xl transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-hover">
                    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                    <line x1="12" y1="22" x2="12" y2="15.5" />
                    <polyline points="22 8.5 12 15.5 2 8.5" />
                  </svg>
                </div>
                <span className="font-bold tracking-tight text-lg text-text-primary">Aether</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                aria-label="Close mobile menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                if (link.disabled) {
                  return (
                    <div key={link.label} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-text-muted opacity-50 cursor-not-allowed">
                      {link.icon}
                      {link.label}
                    </div>
                  );
                }
                return (
                  <Link 
                    key={link.label} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isActive ? "bg-accent/10 text-accent-hover" : "text-text-secondary hover:bg-[rgba(255,255,255,0.06)] hover:text-text-primary"}`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
        </div>
      </div>
    </>
  );
}
