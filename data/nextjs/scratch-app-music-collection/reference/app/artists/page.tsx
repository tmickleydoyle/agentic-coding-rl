"use client";
import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ArtistsPage() {
  const { albums } = useApp();
  const artistMap: Record<string, typeof albums> = {};
  albums.forEach((a) => {
    if (!artistMap[a.artist]) artistMap[a.artist] = [];
    artistMap[a.artist].push(a);
  });

  return (
    <div data-testid="artists-page">
      <h2>Artists</h2>
      <p data-testid="artist-count">Artists: {Object.keys(artistMap).length}</p>
      <ul data-testid="artist-list">
        {Object.keys(artistMap).map((artist) => (
          <li key={artist} data-testid={`artist-item-${artist.toLowerCase().replace(/\s+/g, "-")}`}>
            <span data-testid="artist-name">{artist}</span>
            <span data-testid="artist-album-count">{artistMap[artist].length} albums</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
