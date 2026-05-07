import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { SiX } from "react-icons/si";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-3 flex-wrap" data-testid="share-buttons">
      <span className="text-sm text-muted-foreground font-mono">Share:</span>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full border-white/20 gap-2 h-9"
        onClick={() => window.open(twitterUrl, "_blank")}
        data-testid="btn-share-twitter"
      >
        <SiX className="w-3.5 h-3.5" />
        Post on X
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full border-white/20 gap-2 h-9"
        onClick={handleCopy}
        data-testid="btn-copy-link"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
}
