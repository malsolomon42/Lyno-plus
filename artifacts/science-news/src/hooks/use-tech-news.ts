import { useQuery } from "@tanstack/react-query";

// ── Normalised type both sources map into ──────────────────────────────────
export interface TechArticle {
  id: string;
  title: string;
  description: string;
  cover_image: string | null;
  url: string;
  source: "dev.to" | "hackernews";
  author: string;
  published_at: string;
  reading_time?: number;
  tags: string[];
  reactions: number;
  comments: number;
}

// ── Dev.to raw types ───────────────────────────────────────────────────────
interface DevToRaw {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  social_image: string;
  url: string;
  user: { name: string };
  published_at: string;
  reading_time_minutes: number;
  tag_list: string[];
  positive_reactions_count: number;
  comments_count: number;
}

function fromDevTo(a: DevToRaw): TechArticle {
  return {
    id: `devto-${a.id}`,
    title: a.title,
    description: a.description || "",
    cover_image: a.cover_image || a.social_image || null,
    url: a.url,
    source: "dev.to",
    author: a.user.name,
    published_at: a.published_at,
    reading_time: a.reading_time_minutes,
    tags: a.tag_list,
    reactions: a.positive_reactions_count,
    comments: a.comments_count,
  };
}

// ── Hacker News (Algolia) raw types ───────────────────────────────────────
interface HNRaw {
  objectID: string;
  title: string;
  url: string | null;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
}

function fromHN(s: HNRaw): TechArticle {
  return {
    id: `hn-${s.objectID}`,
    title: s.title,
    description: `Trending on Hacker News · ${s.points} points · ${s.num_comments} comments`,
    cover_image: null,
    url: s.url || `https://news.ycombinator.com/item?id=${s.objectID}`,
    source: "hackernews",
    author: s.author,
    published_at: s.created_at,
    tags: [],
    reactions: s.points,
    comments: s.num_comments,
  };
}

// ── Query hooks ────────────────────────────────────────────────────────────
export function useDevToArticles(tag?: string, limit = 12) {
  const url = tag
    ? `https://dev.to/api/articles?top=1&per_page=${limit}&tag=${encodeURIComponent(tag)}`
    : `https://dev.to/api/articles?top=1&per_page=${limit}`;

  return useQuery<TechArticle[]>({
    queryKey: ["devto", tag, limit],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Dev.to fetch failed");
      const data: DevToRaw[] = await res.json();
      return data.map(fromDevTo);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useHNStories(query?: string, limit = 10) {
  const base = query
    ? `https://hn.algolia.com/api/v1/search_by_date?tags=story&query=${encodeURIComponent(query)}&hitsPerPage=${limit}&numericFilters=points>15`
    : `https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=${limit}`;

  return useQuery<TechArticle[]>({
    queryKey: ["hn", query, limit],
    queryFn: async () => {
      const res = await fetch(base);
      if (!res.ok) throw new Error("HN fetch failed");
      const data: { hits: HNRaw[] } = await res.json();
      return data.hits.filter(h => h.title && h.url).map(fromHN);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Combined trending: top Dev.to + HN front page interleaved
export function useTrendingTech() {
  const devto = useDevToArticles(undefined, 10);
  const hn = useHNStories(undefined, 8);
  const articles: TechArticle[] = [];
  const dt = devto.data || [];
  const h = hn.data || [];
  const max = Math.max(dt.length, h.length);
  for (let i = 0; i < max; i++) {
    if (dt[i]) articles.push(dt[i]);
    if (h[i]) articles.push(h[i]);
  }
  return { articles, isLoading: devto.isLoading || hn.isLoading };
}
