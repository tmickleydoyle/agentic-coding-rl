import type { Album, Ownership, Playlist } from "./types";

let albums: Album[] = [
  { id: "1", title: "Kind of Blue", artist: "Miles Davis", genre: "Jazz", year: 1959, tracks: 5, ownership: "owned", addedAt: "2024-01-01" },
  { id: "2", title: "Thriller", artist: "Michael Jackson", genre: "Pop", year: 1982, tracks: 9, ownership: "streaming", addedAt: "2024-01-10" },
];
let playlists: Playlist[] = [];
let nextAlbumId = 3;
let nextPlaylistId = 1;

export function getAlbums(): Album[] { return albums; }
export function addAlbum(data: Omit<Album, "id" | "addedAt" | "ownership">): Album {
  const album: Album = { id: String(nextAlbumId++), ...data, ownership: "want", addedAt: new Date().toISOString().slice(0, 10) };
  albums.push(album);
  return album;
}
export function updateAlbumOwnership(id: string, ownership: Ownership): Album | null {
  const album = albums.find((a) => a.id === id);
  if (!album) return null;
  album.ownership = ownership;
  return album;
}
export function removeAlbum(id: string): boolean {
  const before = albums.length;
  albums = albums.filter((a) => a.id !== id);
  return albums.length < before;
}
export function getPlaylists(): Playlist[] { return playlists; }
export function addPlaylist(name: string): Playlist {
  const pl: Playlist = { id: String(nextPlaylistId++), name, albumIds: [] };
  playlists.push(pl);
  return pl;
}
export function addAlbumToPlaylist(playlistId: string, albumId: string): Playlist | null {
  const pl = playlists.find((p) => p.id === playlistId);
  if (!pl) return null;
  if (!pl.albumIds.includes(albumId)) pl.albumIds.push(albumId);
  return pl;
}
export function __reset(): void {
  albums = [
    { id: "1", title: "Kind of Blue", artist: "Miles Davis", genre: "Jazz", year: 1959, tracks: 5, ownership: "owned", addedAt: "2024-01-01" },
    { id: "2", title: "Thriller", artist: "Michael Jackson", genre: "Pop", year: 1982, tracks: 9, ownership: "streaming", addedAt: "2024-01-10" },
  ];
  playlists = [];
  nextAlbumId = 3;
  nextPlaylistId = 1;
}
