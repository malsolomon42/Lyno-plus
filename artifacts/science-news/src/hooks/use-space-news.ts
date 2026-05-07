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
      const res = await fetch(`${BASE_URL}/articles/?limit=${limit}&offset=${offset}`);
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
      const res = await fetch(`${BASE_URL}/articles/?search=${encodeURIComponent(query)}&limit=${limit}`);
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
      const res = await fetch(`${BASE_URL}/blogs/?limit=${limit}&offset=${offset}`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    },
  });
}
