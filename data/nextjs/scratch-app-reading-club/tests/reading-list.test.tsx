import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
    const method = opts?.method || "GET";
    if (method === "POST") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: "99", status: "want-to-read", addedAt: "2024-06-01", ...body }) };
    }
    if (method === "PATCH") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: body.id, title: "Test", author: "A", genre: "G", pages: 100, status: body.status, addedAt: "2024-01-01" }) };
    }
    if (method === "DELETE") {
      return { json: async () => ({ success: true }) };
    }
    return { json: async () => [] };
  }));
});

describe("Reading List", () => {
  it("shows add book form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reading-list"));
    expect(screen.getByTestId("add-book-form")).toBeTruthy();
  });

  it("adds a book via form", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reading-list"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "New Book" } });
    fireEvent.change(screen.getByTestId("input-author"), { target: { value: "Author" } });
    fireEvent.change(screen.getByTestId("input-genre"), { target: { value: "Fiction" } });
    fireEvent.change(screen.getByTestId("input-pages"), { target: { value: "200" } });
    fireEvent.click(screen.getByTestId("btn-add-book"));
    await waitFor(() => {
      expect(screen.getByTestId("book-item-99")).toBeTruthy();
    });
  });

  it("shows filter controls", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reading-list"));
    expect(screen.getByTestId("filter-all")).toBeTruthy();
    expect(screen.getByTestId("filter-read")).toBeTruthy();
  });
});
