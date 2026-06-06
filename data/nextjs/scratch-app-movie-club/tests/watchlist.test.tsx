import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
    const method = opts?.method || "GET";
    if (method === "POST") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: "99", status: "want-to-watch", rating: null, review: "", addedAt: "2024-06-01", ...body }) };
    }
    if (method === "PATCH") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: body.id, title: "Test", director: "D", genre: "G", year: 2020, runtime: 120, status: body.status || "watched", rating: body.rating ?? null, review: body.review ?? "", addedAt: "2024-01-01" }) };
    }
    if (method === "DELETE") {
      return { json: async () => ({ success: true }) };
    }
    return { json: async () => [] };
  }));
});

describe("Watchlist", () => {
  it("shows add movie form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-watchlist"));
    expect(screen.getByTestId("add-movie-form")).toBeTruthy();
  });

  it("adds a movie", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-watchlist"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "New Movie" } });
    fireEvent.change(screen.getByTestId("input-director"), { target: { value: "Director" } });
    fireEvent.change(screen.getByTestId("input-genre"), { target: { value: "Drama" } });
    fireEvent.change(screen.getByTestId("input-year"), { target: { value: "2023" } });
    fireEvent.change(screen.getByTestId("input-runtime"), { target: { value: "120" } });
    fireEvent.click(screen.getByTestId("btn-add-movie"));
    await waitFor(() => {
      expect(screen.getByTestId("movie-item-99")).toBeTruthy();
    });
  });

  it("shows filter controls", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-watchlist"));
    expect(screen.getByTestId("filter-all")).toBeTruthy();
    expect(screen.getByTestId("filter-watched")).toBeTruthy();
  });
});
