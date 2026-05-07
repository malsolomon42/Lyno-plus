export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="font-mono text-xl font-bold tracking-tight mb-2">CosmosWire</div>
            <p className="text-sm text-muted-foreground">Your trusted mission control for space exploration news.</p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Powered by Spaceflight News API</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
