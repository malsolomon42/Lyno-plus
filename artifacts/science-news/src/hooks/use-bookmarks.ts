import { useState, useEffect, useCallback } from "react";
import { Article } from "./use-space-news";

const STORAGE_KEY = "lynoplus-bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = useCallback((article: Article) => {
    setBookmarks(prev => {
      if (prev.find(a => a.id === article.id)) {
        return prev.filter(a => a.id !== article.id);
      }
      return [article, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((id: number) => {
    setBookmarks(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAll = useCallback(() => setBookmarks([]), []);

  const isBookmarked = useCallback(
    (id: number) => bookmarks.some(a => a.id === id),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, removeBookmark, clearAll, isBookmarked };
}
