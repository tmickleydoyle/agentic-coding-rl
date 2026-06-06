import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const today = new Date().toISOString().split("T")[0];

const seedEntries = [
  { id: "e1", projectId: "p1", date: today, wordCount: 450, notes: "Good session", createdAt: 1000 },
];
const seedProjects = [
  { id: "p1", name: "Novel Draft", dailyGoal: 500, color: "blue" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn((url: string, opts?: RequestInit) => {
    const u = typeof url === "string" ? url : String(url);
    if (u.includes("/api/entries") && (!opts || opts.method === "GET" || !opts.method)) {
      return Promise.resolve({ json: async () => ({ entries: seedEntries }) });
    }
    if (u.includes("/api/projects") && (!opts || opts.method === "GET" || !opts.method)) {
      return Promise.resolve({ json: async () => ({ projects: seedProjects }) });
    }
    if (u.includes("/api/goals")) {
      return Promise.resolve({ json: async () => ({ goals: [] }) });
    }
    return Promise.resolve({ json: async () => ({}) });
  }));
});

describe("Entries page", () => {
  it("shows entries list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-entries"));
    await waitFor(() => expect(screen.getByTestId("entries-list")).toBeTruthy());
  });

  it("shows add entry form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-entries"));
    expect(screen.getByTestId("add-entry-form")).toBeTruthy();
  });

  it("has word count input", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-entries"));
    expect(screen.getByTestId("entry-wordcount")).toBeTruthy();
  });

  it("has add entry button", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-entries"));
    expect(screen.getByTestId("add-entry-btn")).toBeTruthy();
  });
});
