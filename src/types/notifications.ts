export type NotificationType =
  | 'learning_reminder'
  | 'revision'
  | 'daily_challenge'
  | 'weekly_review'
  | 'goal';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  actionUrl: string;
  actionLabel: string;
}

export interface ReminderPreferences {
  enabled: boolean;
  preferredDays: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  preferredTime: string; // '09:00'
  learningReminders: boolean;
  revisionReminders: boolean;
  dailyChallengeReminders: boolean;
  weeklyReviewReminders: boolean;
}
