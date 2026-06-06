import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (_url: string, opts?: RequestInit) => {
    const method = opts?.method || "GET";
    if (method === "POST") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: "99", completed: false, completedAt: null, addedAt: "2024-06-01", ...body }) };
    }
    if (method === "PATCH") {
      const body = JSON.parse(opts!.body as string);
      return { json: async () => ({ id: body.id, title: "T", description: "", category: "Cat", targetDate: "", difficulty: "medium", completed: body.completed ?? false, completedAt: body.completed ? "2024-06-01" : null, addedAt: "2024-01-01" }) };
    }
    if (method === "DELETE") return { json: async () => ({ success: true }) };
    return { json: async () => [] };
  }));
});

describe("Goals", () => {
  it("shows add goal form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("add-goal-form")).toBeTruthy();
  });
  it("adds a goal", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "New Goal" } });
    fireEvent.change(screen.getByTestId("input-category"), { target: { value: "Travel" } });
    fireEvent.click(screen.getByTestId("btn-add-goal"));
    await waitFor(() => { expect(screen.getByTestId("goal-item-99")).toBeTruthy(); });
  });
  it("shows filter-all control", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("filter-all")).toBeTruthy();
  });
  it("shows goal list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goal-list")).toBeTruthy();
  });
});
