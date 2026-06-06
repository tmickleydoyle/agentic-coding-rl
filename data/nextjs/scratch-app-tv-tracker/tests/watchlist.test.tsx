import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
    const method = opts?.method || "GET";
    if (method === "POST") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: "99", status: "want-to-watch", currentSeason: 1, currentEpisode: 1, favorite: false, addedAt: "2024-06-01", ...body }) };
    }
    if (method === "PATCH") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: body.id, title: "T", network: "N", genre: "G", totalSeasons: 3, status: body.status || "watching", currentSeason: body.currentSeason || 1, currentEpisode: body.currentEpisode || 1, favorite: body.favorite ?? false, addedAt: "2024-01-01" }) };
    }
    if (method === "DELETE") return { json: async () => ({ success: true }) };
    return { json: async () => [] };
  }));
});

describe("Watchlist", () => {
  it("shows add show form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-watchlist"));
    expect(screen.getByTestId("add-show-form")).toBeTruthy();
  });
  it("adds a show", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-watchlist"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "New Show" } });
    fireEvent.change(screen.getByTestId("input-network"), { target: { value: "HBO" } });
    fireEvent.change(screen.getByTestId("input-genre"), { target: { value: "Drama" } });
    fireEvent.change(screen.getByTestId("input-total-seasons"), { target: { value: "3" } });
    fireEvent.click(screen.getByTestId("btn-add-show"));
    await waitFor(() => { expect(screen.getByTestId("show-item-99")).toBeTruthy(); });
  });
  it("shows filter controls", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-watchlist"));
    expect(screen.getByTestId("filter-all")).toBeTruthy();
    expect(screen.getByTestId("filter-completed")).toBeTruthy();
  });
});
