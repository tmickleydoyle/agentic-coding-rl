import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
    const method = opts?.method || "GET";
    if (method === "POST") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: "99", status: "wishlist", hoursPlayed: 0, addedAt: "2024-06-01", ...body }) };
    }
    if (method === "PATCH") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: body.id, title: "T", developer: "D", genre: "RPG", platform: "PC", estimatedHours: 20, hoursPlayed: body.hoursPlayed ?? 0, status: body.status || "owned", addedAt: "2024-01-01" }) };
    }
    if (method === "DELETE") return { json: async () => ({ success: true }) };
    return { json: async () => [] };
  }));
});

describe("Collection", () => {
  it("shows add game form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-collection"));
    expect(screen.getByTestId("add-game-form")).toBeTruthy();
  });
  it("adds a game", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-collection"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "New Game" } });
    fireEvent.change(screen.getByTestId("input-developer"), { target: { value: "Dev" } });
    fireEvent.change(screen.getByTestId("input-genre"), { target: { value: "RPG" } });
    fireEvent.change(screen.getByTestId("input-platform"), { target: { value: "PC" } });
    fireEvent.change(screen.getByTestId("input-estimated-hours"), { target: { value: "20" } });
    fireEvent.click(screen.getByTestId("btn-add-game"));
    await waitFor(() => { expect(screen.getByTestId("game-item-99")).toBeTruthy(); });
  });
  it("shows filter controls", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-collection"));
    expect(screen.getByTestId("filter-all")).toBeTruthy();
    expect(screen.getByTestId("filter-completed")).toBeTruthy();
  });
});
