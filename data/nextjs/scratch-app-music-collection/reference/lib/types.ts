export type Ownership = "want" | "owned" | "streaming";

export interface Album {
  id: string;
  title: string;
  artist: string;
  genre: string;
  year: number;
  tracks: number;
  ownership: Ownership;
  addedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  albumIds: string[];
}

export type Route = "/" | "/library" | "/playlists" | "/artists";
