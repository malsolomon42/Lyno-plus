import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Search, Rocket, Bookmark, Menu, X, Compass, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/category/Launches", label: "Launches" },
  { href: "/category/Mars", label: "Mars" },
  { href: "/category/Moon", label: "Moon" },
  { href: "/category/Deep Space", label: "Deep Space" },
  { href: "/category/Technology", label: "Technology" },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { bookmarks } = useBookmarks();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
          <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <span className="font-mono text-xl font-bold tracking-tight">CosmosWire</span>
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
          <Link href="/search" data-testid="link-search">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-full"
            >
              <Search className="w-5 h-5" />
            </Button>
          </Link>

          <Link href="/bookmarks" data-testid="link-bookmarks">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground rounded-full relative"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarks.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              )}
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
            className="lg:hidden border-t border-white/10 bg-background/95 backdrop-blur-md overflow-hidden"
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
