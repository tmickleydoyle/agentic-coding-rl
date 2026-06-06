import type { Podcast, Episode } from "./types";

let podcasts: Podcast[] = [
  {
    id: "1", title: "Tech Talk", host: "Alice", category: "Technology", description: "All about tech", addedAt: "2024-01-01",
    episodes: [
      { id: "e1", podcastId: "1", title: "Intro to AI", duration: 45, played: true, playedAt: "2024-01-02" },
      { id: "e2", podcastId: "1", title: "Cloud Basics", duration: 38, played: false, playedAt: null },
    ],
  },
];
let nextPodcastId = 2;
let nextEpisodeId = 3;

export function getPodcasts(): Podcast[] { return podcasts; }
export function addPodcast(data: Omit<Podcast, "id" | "addedAt" | "episodes">): Podcast {
  const p: Podcast = { id: String(nextPodcastId++), ...data, addedAt: new Date().toISOString().slice(0, 10), episodes: [] };
  podcasts.push(p);
  return p;
}
export function removePodcast(id: string): boolean {
  const before = podcasts.length;
  podcasts = podcasts.filter((p) => p.id !== id);
  return podcasts.length < before;
}
export function markEpisode(episodeId: string, played: boolean): Episode | null {
  for (const p of podcasts) {
    const ep = p.episodes.find((e) => e.id === episodeId);
    if (ep) { ep.played = played; ep.playedAt = played ? new Date().toISOString().slice(0, 10) : null; return ep; }
  }
  return null;
}
export function addEpisode(podcastId: string, data: Omit<Episode, "id" | "podcastId" | "played" | "playedAt">): Episode | null {
  const p = podcasts.find((pod) => pod.id === podcastId);
  if (!p) return null;
  const ep: Episode = { id: `e${nextEpisodeId++}`, podcastId, ...data, played: false, playedAt: null };
  p.episodes.push(ep);
  return ep;
}
export function __reset(): void {
  podcasts = [
    {
      id: "1", title: "Tech Talk", host: "Alice", category: "Technology", description: "All about tech", addedAt: "2024-01-01",
      episodes: [
        { id: "e1", podcastId: "1", title: "Intro to AI", duration: 45, played: true, playedAt: "2024-01-02" },
        { id: "e2", podcastId: "1", title: "Cloud Basics", duration: 38, played: false, playedAt: null },
      ],
    },
  ];
  nextPodcastId = 2;
  nextEpisodeId = 3;
}
