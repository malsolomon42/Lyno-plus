import { useBookmarks } from "@/hooks/use-bookmarks";
import { ArticleGrid } from "@/components/article-grid";
import { Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function BookmarksPage() {
  const { bookmarks, clearAll } = useBookmarks();

  return (
    <div className="container mx-auto px-4 py-12 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10 border-b border-white/10 pb-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
            <Bookmark className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Saved Articles</h1>
            <p className="text-muted-foreground mt-1 font-mono text-sm">
              {bookmarks.length} article{bookmarks.length !== 1 ? "s" : ""} in your collection
            </p>
          </div>
        </div>
        {bookmarks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive gap-2"
            onClick={clearAll}
            data-testid="btn-clear-bookmarks"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </motion.div>

      {bookmarks.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground"
          data-testid="bookmarks-empty"
        >
          <div className="w-20 h-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-6">
            <Bookmark className="w-10 h-10 opacity-30" />
          </div>
          <p className="text-xl font-semibold mb-2">Your reading list is empty</p>
          <p className="text-sm mb-8 max-w-xs">
            Bookmark articles as you explore the cosmos to build your personal reading list.
          </p>
          <Link href="/">
            <Button className="rounded-full" data-testid="link-explore-now">
              Explore News
            </Button>
          </Link>
        </div>
      ) : (
        <ArticleGrid articles={bookmarks} />
      )}
    </div>
  );
}
