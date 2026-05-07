import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://api.spaceflightnewsapi.net/v4";

export interface Article {
  id: number;
  title: string;
  url: string;
  image_url: string;
  news_site: string;
  summary: string;
  published_at: string;
  updated_at: string;
  featured: boolean;
  launches: Array<{ id: string; provider: string }>;
  events: Array<{ id: string; provider: string }>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function useArticles({ limit = 20, offset = 0 } = {}) {
  return useQuery<PaginatedResponse<Article>>({
    queryKey: ["articles", limit, offset],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/articles/?limit=${limit}&offset=${offset}&ordering=-published_at`
      );
      if (!res.ok) throw new Error("Failed to fetch articles");
      return res.json();
    },
  });
}

export function useSearchArticles(query: string, { limit = 20 } = {}) {
  return useQuery<PaginatedResponse<Article>>({
    queryKey: ["articles", "search", query, limit],
    queryFn: async () => {
      if (!query) return { count: 0, next: null, previous: null, results: [] };
      const res = await fetch(
        `${BASE_URL}/articles/?search=${encodeURIComponent(query)}&limit=${limit}&ordering=-published_at`
      );
      if (!res.ok) throw new Error("Failed to search articles");
      return res.json();
    },
    enabled: query.length > 0,
  });
}

export function useArticle(id: string) {
  return useQuery<Article>({
    queryKey: ["article", id],
    queryFn: async () => {
      if (!id) throw new Error("No article ID provided");
      const res = await fetch(`${BASE_URL}/articles/${id}/`);
      if (!res.ok) throw new Error("Failed to fetch article");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useBlogs({ limit = 20, offset = 0 } = {}) {
  return useQuery<PaginatedResponse<Article>>({
    queryKey: ["blogs", limit, offset],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/blogs/?limit=${limit}&offset=${offset}&ordering=-published_at`
      );
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
  });
}

export function useRelatedArticles(newsSite: string, excludeId: number) {
  return useQuery<PaginatedResponse<Article>>({
    queryKey: ["articles", "related", newsSite, excludeId],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/articles/?news_site=${encodeURIComponent(newsSite)}&limit=4&ordering=-published_at`
      );
      if (!res.ok) throw new Error("Failed to fetch related articles");
      const data: PaginatedResponse<Article> = await res.json();
      return {
        ...data,
        results: data.results.filter((a) => a.id !== excludeId).slice(0, 3),
      };
    },
    enabled: !!newsSite && !!excludeId,
  });
}

export function useTrendingArticles() {
  return useQuery<PaginatedResponse<Article>>({
    queryKey: ["articles", "trending"],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/articles/?limit=5&ordering=-published_at`
      );
      if (!res.ok) throw new Error("Failed to fetch trending");
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });
}
