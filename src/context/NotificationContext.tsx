import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification, ReminderPreferences } from '../types/notifications';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  reminderPreferences: ReminderPreferences;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  updateReminderPreferences: (partial: Partial<ReminderPreferences>) => void;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Review Ready',
    message: '8 vocabulary words & 2 grammar concepts are due for spaced repetition review.',
    type: 'revision',
    timestamp: '10m ago',
    read: false,
    actionUrl: '/vocabulary',
    actionLabel: 'Review Now',
  },
  {
    id: 'notif-2',
    title: 'New Daily Challenge Ready',
    message: 'Speak for 60 seconds about "A Skill I Want to Improve". Earn +100 XP!',
    type: 'daily_challenge',
    timestamp: '1h ago',
    read: false,
    actionUrl: '/practice',
    actionLabel: 'Start Challenge',
  },
  {
    id: 'notif-3',
    title: 'Weekly Progress Review',
    message: 'Your speech rate improved by 51% this week with 4 fewer filler words.',
    type: 'weekly_review',
    timestamp: 'Yesterday',
    read: true,
    actionUrl: '/progress',
    actionLabel: 'View Analysis',
  },
  {
    id: 'notif-4',
    title: 'Goal Target Milestone',
    message: 'You are only 1 roleplay away from your Interview Preparation milestone!',
    type: 'goal',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/roleplay',
    actionLabel: 'Start Roleplay',
  },
];

const DEFAULT_PREFERENCES: ReminderPreferences = {
  enabled: true,
  preferredDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  preferredTime: '09:00',
  learningReminders: true,
  revisionReminders: true,
  dailyChallengeReminders: true,
  weeklyReviewReminders: true,
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('learntalk_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const [reminderPreferences, setReminderPreferences] = useState<ReminderPreferences>(() => {
    const saved = localStorage.getItem('learntalk_reminder_prefs');
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  useEffect(() => {
    localStorage.setItem('learntalk_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('learntalk_reminder_prefs', JSON.stringify(reminderPreferences));
  }, [reminderPreferences]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateReminderPreferences = (partial: Partial<ReminderPreferences>) => {
    setReminderPreferences((prev) => ({ ...prev, ...partial }));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        reminderPreferences,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        addNotification,
        updateReminderPreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
