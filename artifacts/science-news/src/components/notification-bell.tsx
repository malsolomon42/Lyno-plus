import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Bell, BellOff, Check, CheckCheck, Trash2, Rocket, Lightbulb, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, NotificationType } from "@/hooks/use-notifications";

const TYPE_CONFIG: Record<NotificationType, { icon: string; color: string; bg: string }> = {
  breaking: { icon: "🚀", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  launch: { icon: "🛸", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  trending_tech: { icon: "💡", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  digest: { icon: "📰", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    permission,
    markRead,
    markAllRead,
    clearAll,
    requestPermission,
    timeAgo,
  } = useNotifications();

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative text-muted-foreground hover:text-foreground rounded-full"
        onClick={() => setOpen(v => !v)}
        data-testid="btn-notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold font-mono px-1 leading-none shadow"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-1rem)] bg-card border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs font-mono bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                    onClick={markAllRead}
                    data-testid="btn-mark-all-read"
                  >
                    <CheckCheck className="w-3 h-3" />
                    All read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={clearAll}
                    data-testid="btn-clear-notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Browser push prompt */}
            {permission === "default" && (
              <div className="mx-3 mt-3 p-3 rounded-xl bg-primary/8 border border-primary/20 flex items-start gap-3">
                <Bell className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground mb-0.5">Enable push notifications</p>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    Get instant alerts for breaking space news and trending tech.
                  </p>
                  <Button
                    size="sm"
                    className="h-6 px-3 text-xs rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={requestPermission}
                    data-testid="btn-enable-push"
                  >
                    Enable
                  </Button>
                </div>
              </div>
            )}

            {permission === "denied" && (
              <div className="mx-3 mt-3 p-3 rounded-xl bg-muted/30 border border-white/5 flex items-center gap-2.5">
                <BellOff className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  Push notifications are blocked. Enable them in your browser settings.
                </p>
              </div>
            )}

            {/* List */}
            <div className="max-h-[340px] overflow-y-auto overscroll-contain">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <Bell className="w-8 h-8 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">You're all caught up</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    New breaking news and trending stories will appear here.
                  </p>
                </div>
              ) : (
                <ul className="p-2 space-y-1">
                  {notifications.map(n => {
                    const cfg = TYPE_CONFIG[n.type];
                    const isInternal = n.href.startsWith("/");
                    return (
                      <li key={n.id}>
                        {isInternal ? (
                          <Link
                            href={n.href}
                            onClick={() => { markRead(n.id); setOpen(false); }}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer group ${
                              n.read ? "opacity-60 hover:opacity-80" : "bg-primary/5 hover:bg-primary/10"
                            }`}
                            data-testid={`notification-${n.id}`}
                          >
                            <NotificationBody n={n} cfg={cfg} timeAgo={timeAgo} markRead={markRead} />
                          </Link>
                        ) : (
                          <a
                            href={n.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markRead(n.id)}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer group ${
                              n.read ? "opacity-60 hover:opacity-80" : "bg-primary/5 hover:bg-primary/10"
                            }`}
                            data-testid={`notification-${n.id}`}
                          >
                            <NotificationBody n={n} cfg={cfg} timeAgo={timeAgo} markRead={markRead} />
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-4 py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground/50 font-mono">
                lyno+ · Breaking news & trending tech alerts
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationBody({
  n,
  cfg,
  timeAgo,
  markRead,
}: {
  n: import("@/hooks/use-notifications").AppNotification;
  cfg: { icon: string; color: string; bg: string };
  timeAgo: (iso: string) => string;
  markRead: (id: string) => void;
}) {
  return (
    <>
      <span className={`text-xl flex-shrink-0 w-8 h-8 rounded-lg ${cfg.bg} border flex items-center justify-center text-base`}>
        {cfg.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${cfg.color}`}>
            {n.title}
          </span>
          <span className="text-[10px] text-muted-foreground/60 font-mono flex-shrink-0">
            {timeAgo(n.timestamp)}
          </span>
        </div>
        <p className="text-xs text-foreground leading-snug line-clamp-2">{n.body}</p>
      </div>
      {!n.read && (
        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
      )}
    </>
  );
}
