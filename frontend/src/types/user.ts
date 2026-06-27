export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface UserSettings {
  theme: 'DARK' | 'LIGHT' | 'SYSTEM';
  timezone: string;
  defaultPlanStartTime: string;
  defaultPlanEndTime: string;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  pomodoroLongBreakMinutes: number;
  weekStartsOn: 'SUNDAY' | 'MONDAY';
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyPlanningReminder: boolean;
  dailyReviewReminder: boolean;
  createdAt: string;
  updatedAt: string;
}
