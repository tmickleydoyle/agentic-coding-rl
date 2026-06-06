export interface Episode {
  id: string;
  podcastId: string;
  title: string;
  duration: number;
  played: boolean;
  playedAt: string | null;
}

export interface Podcast {
  id: string;
  title: string;
  host: string;
  category: string;
  description: string;
  addedAt: string;
  episodes: Episode[];
}

export type Route = "/" | "/subscriptions" | "/episodes" | "/history";
