"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { settingsService } from "@/services/settings.service";
import { UserSettings } from "@/types/user";
import { useToast } from "@/components/feedback/Toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch {
        showToast("Failed to load settings.", "error");
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const updated = await settingsService.updateSettings(settings);
      setSettings(updated);
      showToast("Settings saved successfully.", "success");
    } catch {
      showToast("Failed to save settings.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 lg:p-10 flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your preferences and account configuration.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-sm font-semibold">Profile</h2>
          <p className="mt-1 text-xs text-text-muted">Your public identity on Aether.</p>
        </div>
        
        <div className="card-elevated p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-surface-light border border-border">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-text-muted">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-text-secondary">{user?.email}</p>
              <p className="mt-1 text-xs text-text-muted">Connected via GitHub</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-8 border-border" />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-sm font-semibold">Preferences</h2>
            <p className="mt-1 text-xs text-text-muted">Customize how Aether looks and behaves.</p>
          </div>
          
          <div className="card-elevated p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Theme</label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as UserSettings["theme"] })}
              >
                <option value="DARK">Dark (Default)</option>
                <option value="LIGHT" disabled>Light (Coming Soon)</option>
                <option value="SYSTEM" disabled>System (Coming Soon)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Timezone</label>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
              <p className="text-xs text-text-muted">Currently limited options during v0.3.0</p>
            </div>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-sm font-semibold">Focus Timer</h2>
            <p className="mt-1 text-xs text-text-muted">Configure your default pomodoro durations.</p>
          </div>
          
          <div className="card-elevated p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="space-y-3">
                <label className="text-sm font-medium">Work (min)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                  value={settings.pomodoroWorkMinutes}
                  onChange={(e) => setSettings({ ...settings, pomodoroWorkMinutes: parseInt(e.target.value) || 25 })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Break (min)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                  value={settings.pomodoroBreakMinutes}
                  onChange={(e) => setSettings({ ...settings, pomodoroBreakMinutes: parseInt(e.target.value) || 5 })}
                />
              </div>
              <div className="space-y-3 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                  value={settings.pomodoroLongBreakMinutes}
                  onChange={(e) => setSettings({ ...settings, pomodoroLongBreakMinutes: parseInt(e.target.value) || 15 })}
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="text-sm font-semibold">Notifications</h2>
            <p className="mt-1 text-xs text-text-muted">Manage your reminders.</p>
          </div>
          
          <div className="card-elevated p-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`relative flex h-5 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${settings.dailyPlanningReminder ? 'bg-accent' : 'bg-surface-light border border-border'}`}>
                <div className={`h-3 w-3 rounded-full bg-white transition-transform ${settings.dailyPlanningReminder ? 'translate-x-1.5' : '-translate-x-1.5'}`} />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={settings.dailyPlanningReminder}
                onChange={(e) => setSettings({ ...settings, dailyPlanningReminder: e.target.checked })}
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Daily Planning Reminder</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`relative flex h-5 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${settings.dailyReviewReminder ? 'bg-accent' : 'bg-surface-light border border-border'}`}>
                <div className={`h-3 w-3 rounded-full bg-white transition-transform ${settings.dailyReviewReminder ? 'translate-x-1.5' : '-translate-x-1.5'}`} />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={settings.dailyReviewReminder}
                onChange={(e) => setSettings({ ...settings, dailyReviewReminder: e.target.checked })}
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">End of Day Review Reminder</span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary rounded-lg px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
