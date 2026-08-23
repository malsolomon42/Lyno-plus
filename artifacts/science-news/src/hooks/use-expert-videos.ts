import { useQuery } from "@tanstack/react-query";

export interface ExpertVideo {
  id: string;
  expert: string;
  focus: string;
  description: string;
  channelUrl: string;
  latestUrl: string;
  image: string;
  sourceLabel: string;
}

const VIDEO_DESK: ExpertVideo[] = [
  {
    id: "startalk",
    expert: "Neil deGrasse Tyson",
    focus: "Space, physics & the cosmos",
    description: "Official StarTalk conversations that turn big cosmic questions into clear, curious thinking.",
    channelUrl: "https://www.youtube.com/@StarTalk",
    latestUrl: "https://www.youtube.com/@StarTalk/videos",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1000&auto=format&fit=crop",
    sourceLabel: "StarTalk",
  },
  {
    id: "briancox",
    expert: "Brian Cox",
    focus: "Physics & the universe",
    description: "Search the latest official interviews and lectures from one of science’s most compelling explainers.",
    channelUrl: "https://www.youtube.com/results?search_query=Brian+Cox+physics+official",
    latestUrl: "https://www.youtube.com/results?search_query=Brian+Cox+physics+latest",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1000&auto=format&fit=crop",
    sourceLabel: "YouTube search",
  },
  {
    id: "spacetime",
    expert: "PBS Space Time",
    focus: "Astrophysics & theory",
    description: "Rigorous, visual explainers on black holes, quantum mechanics, time and the edges of knowledge.",
    channelUrl: "https://www.youtube.com/@pbsspacetime",
    latestUrl: "https://www.youtube.com/@pbsspacetime/videos",
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1000&auto=format&fit=crop",
    sourceLabel: "PBS Space Time",
  },
  {
    id: "veritasium",
    expert: "Veritasium",
    focus: "Science & engineering",
    description: "Evidence-led stories and experiments that challenge intuition without sacrificing clarity.",
    channelUrl: "https://www.youtube.com/@veritasium",
    latestUrl: "https://www.youtube.com/@veritasium/videos",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1000&auto=format&fit=crop",
    sourceLabel: "Veritasium",
  },
  {
    id: "royalinstitution",
    expert: "The Royal Institution",
    focus: "Research & discovery",
    description: "Public lectures from scientists and specialists working at the frontiers of discovery.",
    channelUrl: "https://www.youtube.com/@TheRoyalInstitution",
    latestUrl: "https://www.youtube.com/@TheRoyalInstitution/videos",
    image: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=1000&auto=format&fit=crop",
    sourceLabel: "The Royal Institution",
  },
  {
    id: "lexfridman",
    expert: "Lex Fridman Podcast",
    focus: "AI, computing & society",
    description: "Long-form conversations with researchers, builders and leaders shaping the technical future.",
    channelUrl: "https://www.youtube.com/@lexfridman",
    latestUrl: "https://www.youtube.com/@lexfridman/videos",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop",
    sourceLabel: "Lex Fridman",
  },
];

export function useExpertVideos() {
  return useQuery<ExpertVideo[]>({
    queryKey: ["expert-video-desk"],
    queryFn: async () => VIDEO_DESK,
    staleTime: 30 * 60 * 1000,
  });
}
