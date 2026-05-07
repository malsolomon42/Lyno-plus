import { Link } from "wouter";
import { Rocket, Github, Twitter } from "lucide-react";

const FOOTER_LINKS = {
  Explore: [
    { label: "Latest News", href: "/" },
    { label: "Launches", href: "/category/Launches" },
    { label: "Mars", href: "/category/Mars" },
    { label: "Moon", href: "/category/Moon" },
    { label: "Deep Space", href: "/category/Deep Space" },
    { label: "Technology", href: "/category/Technology" },
  ],
  Discover: [
    { label: "Explore All Topics", href: "/explore" },
    { label: "Astronomy", href: "/category/Astronomy" },
    { label: "Satellites", href: "/category/Satellites" },
    { label: "Science", href: "/category/Science" },
    { label: "Search", href: "/search" },
  ],
  Company: [
    { label: "About CosmosWire", href: "/about" },
    { label: "Saved Articles", href: "/bookmarks" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 mt-20">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <span className="font-mono text-xl font-bold tracking-tight">lyno+</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Your mission control for space exploration news. Real-time updates from the
              world's leading space agencies and science institutions. — lyno+
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted/50 hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted/50 hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-footer-github"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground mb-4 font-mono">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} lyno+. All rights reserved.</span>
          <span>
            Powered by{" "}
            <a
              href="https://www.spaceflightnewsapi.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Spaceflight News API
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
