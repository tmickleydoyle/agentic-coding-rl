import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset, getLeaderboard } from "../lib/store";
beforeEach(() => { __reset(); cleanup(); });
describe("leaderboard", () => {
  it("Jordan Lee is rank 1", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-leaderboard"));
    expect(screen.getByTestId("lb-rank-1").textContent).toBe("1");
    expect(screen.getByTestId("lb-name-1").textContent).toBe("Jordan Lee");
  });
  it("leaderboard sorted by points desc", () => {
    const board = getLeaderboard();
    expect(board[0].totalPoints).toBeGreaterThanOrEqual(board[1].totalPoints);
    expect(board[1].totalPoints).toBeGreaterThanOrEqual(board[2].totalPoints);
  });
  it("Riley Chen is rank 3", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-leaderboard"));
    expect(screen.getByTestId("lb-rank-3").textContent).toBe("3");
  });
  it("shows 2 seed games", () => {
    render(<App />);
    expect(screen.getByTestId("game-item-1")).toBeTruthy();
    expect(screen.getByTestId("game-item-2")).toBeTruthy();
  });
});
