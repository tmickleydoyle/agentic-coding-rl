import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Campaign Journal", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: "Campaign Journal" })).toBeTruthy();
  });

  it("shows correct initial stats", () => {
    expect(screen.getByTestId("total-sessions").textContent).toBe("3");
    expect(screen.getByTestId("total-xp").textContent).toBe("1950");
    expect(screen.getByTestId("active-quests").textContent).toBe("1");
  });

  it("renders seed session cards", () => {
    expect(screen.getByTestId("session-card-1")).toBeTruthy();
    expect(screen.getByTestId("session-card-3")).toBeTruthy();
  });

  it("shows correct session data", () => {
    expect(screen.getByTestId("session-title-1").textContent).toBe("The Dark Forest");
    expect(screen.getByTestId("session-date-2").textContent).toBe("2024-02-14");
    expect(screen.getByTestId("session-xp-3").textContent).toBe("1200 XP");
    expect(screen.getByTestId("session-characters-1").textContent).toBe("Aria, Brom");
  });

  it("renders seed quest cards", () => {
    expect(screen.getByTestId("quest-card-1")).toBeTruthy();
    expect(screen.getByTestId("quest-card-2")).toBeTruthy();
    expect(screen.getByTestId("quest-card-3")).toBeTruthy();
  });

  it("shows quest statuses", () => {
    expect(screen.getByTestId("quest-status-1").textContent).toBe("active");
    expect(screen.getByTestId("quest-status-2").textContent).toBe("completed");
    expect(screen.getByTestId("quest-status-3").textContent).toBe("failed");
  });

  it("shows complete and fail buttons only for active quests", () => {
    expect(screen.getByTestId("complete-quest-1")).toBeTruthy();
    expect(screen.getByTestId("fail-quest-1")).toBeTruthy();
    expect(screen.queryByTestId("complete-quest-2")).toBeNull();
    expect(screen.queryByTestId("fail-quest-3")).toBeNull();
  });

  it("completes a quest", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("complete-quest-1"));
    expect(screen.getByTestId("quest-status-1").textContent).toBe("completed");
    expect(screen.queryByTestId("complete-quest-1")).toBeNull();
    expect(screen.getByTestId("active-quests").textContent).toBe("0");
  });

  it("fails a quest", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("fail-quest-1"));
    expect(screen.getByTestId("quest-status-1").textContent).toBe("failed");
    expect(screen.queryByTestId("fail-quest-1")).toBeNull();
  });

  it("removes a quest", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("remove-quest-2"));
    expect(screen.queryByTestId("quest-card-2")).toBeNull();
  });

  it("adds a new quest", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("quest-name-input"), "Explore the Ruins");
    await user.type(screen.getByTestId("quest-reward-input"), "200 gold");
    await user.click(screen.getByTestId("add-quest-btn"));
    expect(screen.getByTestId("active-quests").textContent).toBe("2");
  });

  it("does not add quest with empty name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-quest-btn"));
    expect(screen.getByTestId("active-quests").textContent).toBe("1");
  });

  it("adds a new session", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("session-title-input"), "The Sunken Temple");
    await user.type(screen.getByTestId("session-date-input"), "2024-04-05");
    await user.type(screen.getByTestId("session-summary-input"), "Discovered ancient ruins under the lake");
    await user.type(screen.getByTestId("session-xp-input"), "600");
    await user.click(screen.getByTestId("add-session-btn"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("4");
    expect(screen.getByTestId("total-xp").textContent).toBe("2550");
  });

  it("does not add session with missing title", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("session-date-input"), "2024-04-05");
    await user.type(screen.getByTestId("session-summary-input"), "Summary here");
    await user.click(screen.getByTestId("add-session-btn"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("3");
  });

  it("deletes a session and updates stats", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-session-3"));
    expect(screen.queryByTestId("session-card-3")).toBeNull();
    expect(screen.getByTestId("total-sessions").textContent).toBe("2");
    expect(screen.getByTestId("total-xp").textContent).toBe("750");
  });
});
