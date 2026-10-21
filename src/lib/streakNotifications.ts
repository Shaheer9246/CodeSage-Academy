/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getLocalDateString } from '@/lib/dailyProblem';

export const STREAK_REMINDER_KEY = 'codesage_streak_reminder_enabled';
export const LAST_REMINDER_DATE_KEY = 'codesage_last_streak_reminder_date';

/**
 * Check if the browser environment supports Notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Check if the user has opted-in to streak reminders
 */
export function isStreakReminderEnabled(): boolean {
  if (!isNotificationSupported()) return false;
  try {
    // If explicitly muted/blocked, don't notify
    if (localStorage.getItem(STREAK_REMINDER_KEY) === 'false') return false;
    // If browser permission is granted, it's active by default!
    if (Notification.permission === 'granted') return true;
    return localStorage.getItem(STREAK_REMINDER_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Automatically prompt for notification permission on login / dashboard visit,
 * and activate streak reminders as soon as allowed.
 */
export function autoEnableStreakReminder(): void {
  if (!isNotificationSupported()) return;

  if (Notification.permission === 'granted') {
    if (localStorage.getItem(STREAK_REMINDER_KEY) !== 'false') {
      localStorage.setItem(STREAK_REMINDER_KEY, 'true');
    }
    return;
  }

  // If user hasn't made a choice yet ('default')
  if (Notification.permission === 'default') {
    const askPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          localStorage.setItem(STREAK_REMINDER_KEY, 'true');
        } else if (permission === 'denied') {
          localStorage.setItem(STREAK_REMINDER_KEY, 'false');
        }
      } catch {
        // ignore
      }
    };

    // Modern browsers require a user gesture (tap/click) for the permission prompt
    const onUserInteraction = () => {
      askPermission();
      window.removeEventListener('click', onUserInteraction);
      window.removeEventListener('touchstart', onUserInteraction);
    };

    window.addEventListener('click', onUserInteraction, { once: true });
    window.addEventListener('touchstart', onUserInteraction, { once: true });

    // Also attempt immediately on mount
    askPermission();
  }
}

/**
 * Get current browser notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission and enable streak reminders
 */
export async function enableStreakReminder(): Promise<{ success: boolean; error?: string }> {
  if (!isNotificationSupported()) {
    return { success: false, error: 'Notifications are not supported in this browser' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(STREAK_REMINDER_KEY, 'true');
      return { success: true };
    } else if (permission === 'denied') {
      localStorage.setItem(STREAK_REMINDER_KEY, 'false');
      return { success: false, error: 'Notification permission was denied in your browser settings' };
    } else {
      return { success: false, error: 'Permission was dismissed' };
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Disable streak reminders
 */
export function disableStreakReminder(): void {
  try {
    localStorage.setItem(STREAK_REMINDER_KEY, 'false');
  } catch {
    // ignore
  }
}

/**
 * Evaluates whether to dispatch the evening streak notification:
 * - Reminder is enabled
 * - Notification permission is 'granted'
 * - Current local hour >= 18 (6:00 PM)
 * - User hasn't finished an activity/lesson today
 * - Hasn't already sent a reminder today (capped once per 24 hours)
 */
export function checkAndTriggerStreakReminder(hasActivityToday: boolean): boolean {
  if (!isNotificationSupported()) return false;
  if (!isStreakReminderEnabled()) return false;
  if (Notification.permission !== 'granted') return false;

  const now = new Date();
  const currentHour = now.getHours();

  // Only notify after 6:00 PM (18:00)
  if (currentHour < 18) {
    return false;
  }

  // If user already solved a lesson or DSA today, no reminder needed
  if (hasActivityToday) {
    return false;
  }

  const todayStr = getLocalDateString(now);

  try {
    const lastNotified = localStorage.getItem(LAST_REMINDER_DATE_KEY);
    if (lastNotified === todayStr) {
      return false; // Already notified today
    }

    // Trigger local browser notification
    const notification = new Notification('🔥 Your CodeSage streak is waiting!', {
      body: 'Spend 2 minutes to keep your streak alive today.',
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'codesage-streak-reminder',
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    localStorage.setItem(LAST_REMINDER_DATE_KEY, todayStr);
    return true;
  } catch (err) {
    console.warn('[StreakNotifications] Failed to display notification:', err);
    return false;
  }
}
