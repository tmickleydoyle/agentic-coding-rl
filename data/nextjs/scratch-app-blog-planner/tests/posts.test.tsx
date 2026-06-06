import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const seedPosts = [
  { id: "p1", title: "How to Write Better Headlines", status: "draft", category: "SEO", scheduledDate: "", notes: "", createdAt: 1000 },
  { id: "p2", title: "10 Productivity Hacks", status: "scheduled", category: "Productivity", scheduledDate: "2030-01-15", notes: "", createdAt: 2000 },
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn((url: string) => {
    if (url.includes("/api/posts")) return Promise.resolve({ json: async () => ({ posts: seedPosts }) });
    return Promise.resolve({ json: async () => ({}) });
  }));
});

describe("Posts page", () => {
  it("shows posts list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-posts"));
    await waitFor(() => expect(screen.getByTestId("posts-list")).toBeTruthy());
  });

  it("has add post form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-posts"));
    expect(screen.getByTestId("add-post-form")).toBeTruthy();
  });

  it("has status filter", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-posts"));
    expect(screen.getByTestId("status-filter")).toBeTruthy();
  });

  it("ideas page shows no-ideas when empty", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ posts: [] }) }));
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-ideas"));
    await waitFor(() => expect(screen.getByTestId("no-ideas")).toBeTruthy());
  });

  it("schedule page shows no-schedule when empty", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ posts: [] }) }));
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-schedule"));
    await waitFor(() => expect(screen.getByTestId("no-schedule")).toBeTruthy());
  });
});
