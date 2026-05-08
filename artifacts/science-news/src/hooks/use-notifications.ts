import { useState, useEffect, useCallback } from "react";
import { useArticles } from "@/hooks/use-space-news";
import { useDevToArticles } from "@/hooks/use-tech-news";
import { differenceInHours, differenceInMinutes } from "date-fns";

export type NotificationType = "breaking" | "launch" | "trending_tech" | "digest";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  href: string;
  timestamp: string;
  read: boolean;
  icon: string;
}

const STORAGE_KEY = "lynoplus-notifications";
const SEEN_KEY = "lynoplus-notifications-seen-ids";

function loadStored(): AppNotification[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function loadSeen(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveStored(notifications: AppNotification[]) {
  // Keep max 30 notifications
  const trimmed = notifications.slice(0, 30);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

function saveSeen(seen: Set<string>) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
}

function timeAgo(iso: string): string {
  const mins = differenceInMinutes(new Date(), new Date(iso));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(loadStored);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  const { data: spaceArticles } = useArticles({ limit: 20 });
  const { data: techArticles } = useDevToArticles(undefined, 8);

  // Build new notifications from live data
  useEffect(() => {
    const seen = loadSeen();
    const fresh: AppNotification[] = [];

    // Breaking space news (< 3h old)
    if (spaceArticles?.results) {
      for (const article of spaceArticles.results) {
        const id = `breaking-${article.id}`;
        if (seen.has(id)) continue;
        const hrs = differenceInHours(new Date(), new Date(article.published_at));
        if (hrs < 3) {
          fresh.push({
            id,
            type: "breaking",
            title: "Breaking Space News",
            body: article.title,
            href: `/article/${article.id}`,
            timestamp: article.published_at,
            read: false,
            icon: "🚀",
          });
        }
      }
    }

    // Top trending tech article (first dev.to article)
    if (techArticles && techArticles.length > 0) {
      const top = techArticles[0];
      const id = `tech-${top.id}`;
      if (!seen.has(id)) {
        fresh.push({
          id,
          type: "trending_tech",
          title: "Trending in Tech",
          body: top.title,
          href: top.url,
          timestamp: top.published_at,
          read: false,
          icon: "💡",
        });
      }
    }

    if (fresh.length === 0) return;

    // Mark as seen so we don't duplicate on re-render
    const newSeen = loadSeen();
    fresh.forEach(n => newSeen.add(n.id));
    saveSeen(newSeen);

    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const toAdd = fresh.filter(n => !existingIds.has(n.id));
      if (toAdd.length === 0) return prev;
      const next = [...toAdd, ...prev].slice(0, 30);
      saveStored(next);

      // Fire browser push for truly new ones
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        toAdd.slice(0, 2).forEach(n => {
          new Notification(`lyno+ · ${n.title}`, {
            body: n.body,
            icon: "/favicon.ico",
            tag: n.id,
          });
        });
      }
      return next;
    });
  }, [spaceArticles, techArticles]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveStored(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      saveStored(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveStored([]);
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  return {
    notifications,
    unreadCount,
    permission,
    markRead,
    markAllRead,
    clearAll,
    requestPermission,
    timeAgo,
  };
}
