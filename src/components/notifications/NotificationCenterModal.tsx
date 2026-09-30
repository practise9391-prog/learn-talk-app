import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigation } from '../../context/NavigationContext';
import { NotificationType } from '../../types/notifications';
import {
  Bell,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Trash2,
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } =
    useNotifications();
  const { navigate } = useNavigation();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'revision':
        return <Sparkles size={16} className="text-amber-500" />;
      case 'daily_challenge':
        return <Flame size={16} className="text-orange-500" />;
      case 'weekly_review':
        return <TrendingUp size={16} className="text-emerald-500" />;
      case 'goal':
        return <CheckCircle2 size={16} className="text-primary" />;
      case 'learning_reminder':
      default:
        return <BookOpen size={16} className="text-indigo-500" />;
    }
  };

  const handleActionClick = (url: string, notifId: string) => {
    markAsRead(notifId);
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Bell size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-text">Notification Center</h3>
              <p className="text-[11px] text-text-muted">
                {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-surface border-b border-border text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              filter === 'all'
                ? 'bg-card text-text shadow-2xs border border-border'
                : 'text-text-muted hover:text-text'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              filter === 'unread'
                ? 'bg-card text-text shadow-2xs border border-border'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-5 overflow-y-auto space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-text-muted space-y-2">
              <Bell size={32} className="mx-auto opacity-40" />
              <p className="text-xs">No notifications in this filter.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                  !item.read
                    ? 'bg-card border-primary/40 shadow-xs'
                    : 'bg-surface/50 border-border opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-text">{item.title}</h4>
                        {!item.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => dismissNotification(item.id)}
                    className="text-text-muted hover:text-rose-500 p-1"
                    title="Dismiss"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/60">
                  <span className="text-[10px] text-text-muted font-mono">{item.timestamp}</span>
                  <button
                    type="button"
                    onClick={() => handleActionClick(item.actionUrl, item.id)}
                    className="px-3 py-1 rounded-xl bg-primary text-white text-[11px] font-bold flex items-center gap-1 hover:bg-primary-hover transition-all"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
