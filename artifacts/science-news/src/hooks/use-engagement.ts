import { useState, useCallback } from "react";

function getStorage<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}
function setStorage<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Types ──────────────────────────────────────────────
export type ReactionType = "rocket" | "heart" | "mind" | "star" | "telescope";
export interface Reactions { rocket: number; heart: number; mind: number; star: number; telescope: number; }
export interface Comment { id: string; articleId: number; name: string; message: string; date: string; }
export interface StreakData { current: number; lastVisit: string; longest: number; }
export interface Donation { id: string; name: string; tier: string; amount: number; message: string; date: string; }

// ── Keys ──────────────────────────────────────────────
const K = {
  streak: "cw-streak",
  reads: "cw-reads",
  reactions: "cw-reactions",
  userReactions: "cw-user-reactions",
  comments: "cw-comments",
  poll: "cw-poll",
  pollVotes: "cw-poll-votes",
  donations: "cw-donations",
};

// ── Streak ──────────────────────────────────────────────
export function useStreak(): StreakData {
  const [streak] = useState<StreakData>(() => {
    const d = getStorage<StreakData>(K.streak, { current: 0, lastVisit: "", longest: 0 });
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (d.lastVisit === today) return d;
    const next: StreakData =
      d.lastVisit === yesterday
        ? { current: d.current + 1, lastVisit: today, longest: Math.max(d.longest, d.current + 1) }
        : { current: 1, lastVisit: today, longest: Math.max(d.longest, 1) };
    setStorage(K.streak, next);
    return next;
  });
  return streak;
}

// ── Reads ──────────────────────────────────────────────
export function useArticleReads() {
  const markRead = useCallback((articleId: number) => {
    const reads = getStorage<Record<number, boolean>>(K.reads, {});
    if (!reads[articleId]) { reads[articleId] = true; setStorage(K.reads, reads); }
  }, []);
  const totalReads = useCallback(() => Object.keys(getStorage<Record<number, boolean>>(K.reads, {})).length, []);
  const isRead = useCallback((id: number) => !!getStorage<Record<number, boolean>>(K.reads, {})[id], []);
  return { markRead, totalReads, isRead };
}

// ── Reactions ──────────────────────────────────────────
const DEFAULT_REACTIONS: Reactions = { rocket: 0, heart: 0, mind: 0, star: 0, telescope: 0 };
export function useReactions(articleId: number) {
  const [reactions, setReactions] = useState<Reactions>(() => {
    const all = getStorage<Record<number, Reactions>>(K.reactions, {});
    return all[articleId] || DEFAULT_REACTIONS;
  });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(() => {
    return getStorage<Record<number, ReactionType>>(K.userReactions, {})[articleId] || null;
  });

  const react = useCallback((type: ReactionType) => {
    setReactions(prev => {
      const next = { ...prev };
      const userAll = getStorage<Record<number, ReactionType>>(K.userReactions, {});
      const cur = userAll[articleId];
      if (cur === type) {
        next[type] = Math.max(0, next[type] - 1);
        delete userAll[articleId];
        setUserReaction(null);
      } else {
        if (cur) next[cur] = Math.max(0, next[cur] - 1);
        next[type] = next[type] + 1;
        userAll[articleId] = type;
        setUserReaction(type);
      }
      const all = getStorage<Record<number, Reactions>>(K.reactions, {});
      all[articleId] = next;
      setStorage(K.reactions, all);
      setStorage(K.userReactions, userAll);
      return next;
    });
  }, [articleId]);

  return { reactions, userReaction, react };
}

// ── Comments ──────────────────────────────────────────
export function useComments(articleId: number) {
  const [comments, setComments] = useState<Comment[]>(() => {
    const all = getStorage<Record<number, Comment[]>>(K.comments, {});
    return all[articleId] || [];
  });

  const addComment = useCallback((name: string, message: string) => {
    const c: Comment = { id: Date.now().toString(), articleId, name: name.trim(), message: message.trim(), date: new Date().toISOString() };
    setComments(prev => {
      const next = [...prev, c];
      const all = getStorage<Record<number, Comment[]>>(K.comments, {});
      all[articleId] = next;
      setStorage(K.comments, all);
      return next;
    });
  }, [articleId]);

  const deleteComment = useCallback((id: string) => {
    setComments(prev => {
      const next = prev.filter(c => c.id !== id);
      const all = getStorage<Record<number, Comment[]>>(K.comments, {});
      all[articleId] = next;
      setStorage(K.comments, all);
      return next;
    });
  }, [articleId]);

  return { comments, addComment, deleteComment };
}

// ── Poll ──────────────────────────────────────────────
const SEED_VOTES: Record<string, number> = {
  "Mars Missions": 142, "Moon Landing": 98, "James Webb Discoveries": 201,
  "Space Tourism": 67, "Asteroid Mining": 45,
};
export function usePoll() {
  const [vote, setVote] = useState<string | null>(() => getStorage<string | null>(K.poll, null));
  const [votes, setVotes] = useState<Record<string, number>>(() => getStorage(K.pollVotes, SEED_VOTES));

  const castVote = useCallback((option: string) => {
    if (vote) return;
    setVote(option);
    setVotes(prev => {
      const next = { ...prev, [option]: (prev[option] || 0) + 1 };
      setStorage(K.pollVotes, next);
      setStorage(K.poll, option);
      return next;
    });
  }, [vote]);

  return { vote, votes, castVote };
}

// ── Donations ──────────────────────────────────────────
const SEED_DONATIONS: Donation[] = [
  { id: "s1", name: "Alex M.", tier: "Space Pioneer", amount: 50, message: "Keep the stars shining!", date: "2026-05-01T10:00:00Z" },
  { id: "s2", name: "Priya K.", tier: "Mission Pilot", amount: 25, message: "Love this site!", date: "2026-05-02T14:30:00Z" },
  { id: "s3", name: "Jordan T.", tier: "Cosmonaut", amount: 10, message: "", date: "2026-05-03T09:15:00Z" },
  { id: "s4", name: "Sam W.", tier: "Stargazer", amount: 3, message: "Coffee for the cosmos.", date: "2026-05-04T17:00:00Z" },
  { id: "s5", name: "Lee H.", tier: "Mission Pilot", amount: 25, message: "Best space news site!", date: "2026-05-05T11:45:00Z" },
  { id: "s6", name: "Maria C.", tier: "Space Pioneer", amount: 50, message: "Ad astra!", date: "2026-05-06T08:00:00Z" },
];
const GOAL = 500;

export function useDonations() {
  const [donations, setDonations] = useState<Donation[]>(() => {
    const stored = getStorage<Donation[]>(K.donations, []);
    return stored.length === 0 ? SEED_DONATIONS : stored;
  });

  const totalRaised = donations.reduce((s, d) => s + d.amount, 0);
  const progress = Math.min(100, Math.round((totalRaised / GOAL) * 100));

  const donate = useCallback((name: string, tier: string, amount: number, message: string) => {
    const d: Donation = { id: Date.now().toString(), name, tier, amount, message, date: new Date().toISOString() };
    setDonations(prev => {
      const next = [d, ...prev];
      setStorage(K.donations, next);
      return next;
    });
  }, []);

  return { donations, totalRaised, progress, goal: GOAL, donate };
}
