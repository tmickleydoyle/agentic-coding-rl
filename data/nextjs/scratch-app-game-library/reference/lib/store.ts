import type { Game, GameStatus } from "./types";

let games: Game[] = [
  { id: "1", title: "The Witcher 3", developer: "CD Projekt Red", genre: "RPG", platform: "PC", estimatedHours: 100, hoursPlayed: 80, status: "playing", addedAt: "2024-01-01" },
  { id: "2", title: "Hades", developer: "Supergiant Games", genre: "Roguelike", platform: "PC", estimatedHours: 30, hoursPlayed: 30, status: "completed", addedAt: "2024-01-10" },
];
let nextId = 3;

export function getGames(): Game[] { return games; }
export function addGame(data: Omit<Game, "id" | "addedAt" | "status" | "hoursPlayed">): Game {
  const game: Game = { id: String(nextId++), ...data, status: "wishlist", hoursPlayed: 0, addedAt: new Date().toISOString().slice(0, 10) };
  games.push(game);
  return game;
}
export function updateGame(id: string, patch: Partial<Pick<Game, "status" | "hoursPlayed">>): Game | null {
  const game = games.find((g) => g.id === id);
  if (!game) return null;
  if (patch.status !== undefined) game.status = patch.status as GameStatus;
  if (patch.hoursPlayed !== undefined) game.hoursPlayed = patch.hoursPlayed;
  return game;
}
export function removeGame(id: string): boolean {
  const before = games.length;
  games = games.filter((g) => g.id !== id);
  return games.length < before;
}
export function __reset(): void {
  games = [
    { id: "1", title: "The Witcher 3", developer: "CD Projekt Red", genre: "RPG", platform: "PC", estimatedHours: 100, hoursPlayed: 80, status: "playing", addedAt: "2024-01-01" },
    { id: "2", title: "Hades", developer: "Supergiant Games", genre: "Roguelike", platform: "PC", estimatedHours: 30, hoursPlayed: 30, status: "completed", addedAt: "2024-01-10" },
  ];
  nextId = 3;
}
