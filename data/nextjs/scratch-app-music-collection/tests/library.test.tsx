import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
    const method = opts?.method || "GET";
    if (method === "POST") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: "99", ownership: "want", addedAt: "2024-06-01", ...body }) };
    }
    if (method === "PATCH") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: body.id, title: "T", artist: "A", genre: "G", year: 2000, tracks: 10, ownership: body.ownership, addedAt: "2024-01-01" }) };
    }
    if (method === "DELETE") return { json: async () => ({ success: true }) };
    return { json: async () => [] };
  }));
});

describe("Library", () => {
  it("shows add album form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-library"));
    expect(screen.getByTestId("add-album-form")).toBeTruthy();
  });
  it("adds an album", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-library"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "New Album" } });
    fireEvent.change(screen.getByTestId("input-artist"), { target: { value: "Artist" } });
    fireEvent.change(screen.getByTestId("input-genre"), { target: { value: "Rock" } });
    fireEvent.change(screen.getByTestId("input-year"), { target: { value: "2023" } });
    fireEvent.change(screen.getByTestId("input-tracks"), { target: { value: "12" } });
    fireEvent.click(screen.getByTestId("btn-add-album"));
    await waitFor(() => { expect(screen.getByTestId("album-item-99")).toBeTruthy(); });
  });
  it("shows filter controls", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-library"));
    expect(screen.getByTestId("filter-all")).toBeTruthy();
  });
});
