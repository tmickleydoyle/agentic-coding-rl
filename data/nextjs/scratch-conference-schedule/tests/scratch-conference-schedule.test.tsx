import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Conference Schedule", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /conference schedule/i })).toBeTruthy();
  });

  it("shows Day 1 sessions by default", () => {
    expect(screen.getByTestId("session-1")).toBeTruthy();
    expect(screen.getByTestId("session-2")).toBeTruthy();
  });

  it("does not show Day 2 sessions on initial render", () => {
    expect(screen.queryByTestId("session-5")).toBeNull();
    expect(screen.queryByTestId("session-6")).toBeNull();
  });

  it("switches to Day 2 when Day 2 tab is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("day-tab-2"));
    expect(screen.getByTestId("session-5")).toBeTruthy();
    expect(screen.queryByTestId("session-1")).toBeNull();
  });

  it("shows correct session count for Day 1", () => {
    expect(screen.getByTestId("session-count").textContent).toContain("4");
  });

  it("filters by track Frontend on Day 1", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("track-filter-frontend"));
    expect(screen.getByTestId("session-2")).toBeTruthy();
    expect(screen.queryByTestId("session-1")).toBeNull();
    expect(screen.queryByTestId("session-3")).toBeNull();
  });

  it("track filter button shows aria-pressed true when active", async () => {
    const user = userEvent.setup();
    const btn = screen.getByTestId("track-filter-backend");
    await user.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });

  it("toggles bookmark on a session card", async () => {
    const user = userEvent.setup();
    const btn = screen.getByTestId("bookmark-btn-1");
    await user.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });

  it("bookmarks only toggle shows only bookmarked sessions", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("bookmark-btn-2"));
    await user.click(screen.getByTestId("bookmarks-only-toggle"));
    expect(screen.getByTestId("session-2")).toBeTruthy();
    expect(screen.queryByTestId("session-1")).toBeNull();
  });

  it("shows No sessions found when filter yields zero results", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("bookmarks-only-toggle"));
    expect(screen.getByTestId("no-sessions")).toBeTruthy();
  });

  it("session card displays title, speaker, time, room, duration, and track", () => {
    expect(screen.getByTestId("session-title-1").textContent).toBe("Keynote: Future of AI");
    expect(screen.getByTestId("session-speaker-1").textContent).toBe("Dr. Ada Lovelace");
    expect(screen.getByTestId("session-time-1").textContent).toBe("09:00");
    expect(screen.getByTestId("session-room-1").textContent).toBe("Main Hall");
    expect(screen.getByTestId("session-duration-1").textContent).toContain("60");
    expect(screen.getByTestId("session-track-1").textContent).toBe("Keynote");
  });

  it("session count updates after track filter", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("track-filter-keynote"));
    expect(screen.getByTestId("session-count").textContent).toContain("1");
  });

  it("Day 2 Backend filter shows only GraphQL session", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("day-tab-2"));
    await user.click(screen.getByTestId("track-filter-backend"));
    expect(screen.getByTestId("session-5")).toBeTruthy();
    expect(screen.queryByTestId("session-6")).toBeNull();
  });

  it("bookmark can be toggled off", async () => {
    const user = userEvent.setup();
    const btn = screen.getByTestId("bookmark-btn-3");
    await user.click(btn);
    await user.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("false");
  });
});
