import { Link } from "wouter";
import { Moon, Sun, Search, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
          <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <span className="font-mono text-xl font-bold tracking-tight">CosmosWire</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/category/Launches" className="hover:text-primary transition-colors" data-testid="link-cat-launches">Launches</Link>
          <Link href="/category/Mars" className="hover:text-primary transition-colors" data-testid="link-cat-mars">Mars</Link>
          <Link href="/category/Moon" className="hover:text-primary transition-colors" data-testid="link-cat-moon">Moon</Link>
          <Link href="/category/Technology" className="hover:text-primary transition-colors" data-testid="link-cat-tech">Technology</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/search" data-testid="link-search">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
              <Search className="w-5 h-5" />
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
        </div>
      </div>
    </header>
  );
}
