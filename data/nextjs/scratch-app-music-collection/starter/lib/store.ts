import type { Album, Ownership, Playlist } from "./types";
export function getAlbums(): Album[] { return []; }
export function addAlbum(_data: Omit<Album, "id" | "addedAt" | "ownership">): Album { throw new Error("Not implemented"); }
export function updateAlbumOwnership(_id: string, _ownership: Ownership): Album | null { return null; }
export function removeAlbum(_id: string): boolean { return false; }
export function getPlaylists(): Playlist[] { return []; }
export function addPlaylist(_name: string): Playlist { throw new Error("Not implemented"); }
export function addAlbumToPlaylist(_playlistId: string, _albumId: string): Playlist | null { return null; }
export function __reset(): void {}
