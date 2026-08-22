import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Search, Bookmark, Menu, X, Compass, Info, Heart, Cpu, LogOut, User } from "lucide-react";
import { AnimatedLogo } from "@/components/animated-logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { ReadingStreak } from "@/components/reading-streak";
import { NotificationBell } from "@/components/notification-bell";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@workspace/replit-auth-web";

const NAV_LINKS = [
  { href: "/launches", label: "Countdowns" },
  { href: "/category/Mars", label: "Mars" },
  { href: "/category/Moon", label: "Moon" },
  { href: "/category/Deep Space", label: "Deep Space" },
  { href: "/tech", label: "Tech & Science", icon: Cpu },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { bookmarks } = useBookmarks();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : user?.email?.split("@")[0] ?? "You";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80" style={{ WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" data-testid="link-home">
          <AnimatedLogo size="sm" showText={true} />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-full transition-colors hover:text-primary hover:bg-primary/10 ${
                location === link.href ? "text-primary bg-primary/10" : ""
              }`}
              data-testid={`link-nav-${link.label.toLowerCase().replace(" ", "-")}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ReadingStreak />

          <NotificationBell />

          <Link href="/search" data-testid="link-search">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
              <Search className="w-5 h-5" />
            </Button>
          </Link>

          <Link href="/bookmarks" data-testid="link-bookmarks">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full relative">
              <Bookmark className="w-5 h-5" />
              {bookmarks.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
          </Link>

          <Link href="/support" data-testid="link-support-nav">
            <Button
              size="sm"
              className="hidden sm:flex rounded-full h-8 px-3 gap-1.5 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 text-xs font-semibold"
              variant="ghost"
            >
              <Heart className="w-3.5 h-3.5" />
              Support
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-testid="btn-toggle-theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* User avatar / auth */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full h-8 px-2 hover:bg-white/10 transition-colors"
                aria-label="User menu"
              >
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={displayName}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                  >
                    {displayName[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <span className="hidden lg:block text-xs font-medium text-foreground/80 max-w-[80px] truncate">
                  {displayName}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 w-48 rounded-xl border border-white/10 py-1.5 z-50"
                    style={{
                      background: "hsl(222 47% 10% / 0.97)",
                      WebkitBackdropFilter: "blur(16px)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                      {user?.email && (
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      )}
                    </div>
                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

           {!isAuthenticated && (
             <div className="relative hidden sm:block">
               <button
                 onClick={() => setUserMenuOpen(!userMenuOpen)}
                 className="flex items-center gap-1.5 rounded-full h-8 px-3 text-xs font-semibold transition-colors"
                 style={{
                   background: "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(124,58,237,0.25))",
                   border: "1px solid rgba(99,102,241,0.4)",
                   color: "#a5b4fc",
                 }}
                 aria-label="Account menu"
               >
                 <User className="w-3.5 h-3.5" />
                 Account
               </button>
               <AnimatePresence>
                 {userMenuOpen && (
                   <motion.div
                     initial={{ opacity: 0, scale: 0.92, y: -4 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.92, y: -4 }}
                     className="absolute right-0 top-10 w-44 rounded-xl border border-white/10 py-1.5 z-50"
                     style={{ background: "hsl(222 47% 10% / 0.97)", WebkitBackdropFilter: "blur(16px)", backdropFilter: "blur(16px)" }}
                   >
                     <button
                       onClick={() => { setUserMenuOpen(false); window.location.href = "/api/login"; }}
                       className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                     >
                       <User className="w-4 h-4" />
                       Log in
                     </button>
                     <button
                       onClick={() => { setUserMenuOpen(false); window.location.href = "/api/login"; }}
                       className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                     >
                       <User className="w-4 h-4" />
                       Sign up
                     </button>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
           )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-muted-foreground hover:text-foreground rounded-full"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="btn-mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 overflow-hidden"
            style={{ background: "hsl(222 47% 8% / 0.97)", WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/bookmarks"
                className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <Bookmark className="w-4 h-4" />
                Saved Articles
                {bookmarks.length > 0 && (
                  <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono">
                    {bookmarks.length}
                  </span>
                )}
              </Link>
              <Link
                href="/support"
                className="px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
                data-testid="link-mobile-support"
              >
                <Heart className="w-4 h-4" />
                Support lyno+
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              )}
              {!isAuthenticated && (
                 <>
                   <button
                     onClick={() => { setMobileOpen(false); window.location.href = "/api/login"; }}
                     className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                   >
                     <User className="w-4 h-4" />
                     Log in
                   </button>
                   <button
                     onClick={() => { setMobileOpen(false); window.location.href = "/api/login"; }}
                     className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                   >
                     <User className="w-4 h-4" />
                     Sign up
                   </button>
                 </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
