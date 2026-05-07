import { useQuery } from "@tanstack/react-query";

export interface Launch {
  id: string;
  name: string;
  net: string;
  status: { name: string; abbrev: string; description: string };
  rocket: { configuration: { name: string; full_name: string } };
  launch_service_provider: { name: string; type: string };
  mission: { name: string; description: string; type: string } | null;
  pad: { name: string; location: { name: string } };
  image: string | null;
  url: string;
}

interface LaunchResponse {
  count: number;
  results: Launch[];
}

export function useUpcomingLaunches() {
  return useQuery<LaunchResponse>({
    queryKey: ["launches", "upcoming"],
    queryFn: async () => {
      const res = await fetch(
        "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?format=json&limit=12&ordering=net",
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error("Failed to fetch launches");
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}
