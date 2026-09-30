import {NotificationRecord} from '../services/api';

/** Shape used by the notification screens. Built from the API, not hardcoded. */
export interface NotificationItem {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  detailIntro: string;
  loanDetails: {label: string; value: string}[];
  whatsNext: string;
  needAssistance: string;
  isRead?: boolean;
}

/**
 * Kept only so old imports don't break. Notifications now come from the
 * server (GET /api/notifications) and only exist after a real event happens.
 */
export const NOTIFICATIONS: NotificationItem[] = [];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-09-29 15:45:00" -> "Today 03:45 PM" / "Yesterday 09:10 AM" / "25 Sep 2026 03:45 PM" */
export const formatNotificationTime = (value: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(value || '');
  if (!m) {
    return '';
  }
  const [, y, mo, d, hh, mm] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - date.getTime()) / 86400000);

  const h = Number(hh);
  const time = `${String(h % 12 || 12).padStart(2, '0')}:${mm} ${h >= 12 ? 'PM' : 'AM'}`;
  const day =
    diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${d} ${MONTHS[Number(mo) - 1]} ${y}`;
  return `${day} ${time}`;
};

export const toNotificationItem = (n: NotificationRecord): NotificationItem => {
  const data = n.data || {};
  return {
    id: String(n.id),
    title: n.title,
    summary: n.message,
    timestamp: formatNotificationTime(n.created_at),
    detailIntro: data.intro || n.message,
    loanDetails: data.loanDetails || [],
    whatsNext: data.whatsNext || '',
    needAssistance: data.needAssistance || '',
    isRead: Boolean(n.is_read),
  };
};