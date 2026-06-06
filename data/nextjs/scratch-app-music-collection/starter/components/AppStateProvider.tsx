"use client";
import React, { createContext, useContext, useState } from "react";
import type { Album, Playlist, Route } from "../lib/types";

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  albums: Album[];
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  playlists: Playlist[];
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
}

const AppContext = createContext<AppContextValue>({ route: "/", navigate: () => {}, albums: [], setAlbums: () => {}, playlists: [], setPlaylists: () => {} });
export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("/");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, albums, setAlbums, playlists, setPlaylists }}>{children}</AppContext.Provider>;
}
