import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";
beforeEach(() => { __reset(); cleanup(); });
describe("navigation", () => {
  it("renders games by default", () => {
    render(<App />);
    expect(screen.getByTestId("games-page")).toBeTruthy();
  });
  it("navigates to players", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-players"));
    expect(screen.getByTestId("players-page")).toBeTruthy();
  });
  it("navigates to leaderboard", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-leaderboard"));
    expect(screen.getByTestId("leaderboard-page")).toBeTruthy();
  });
  it("navigates back to games", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-leaderboard"));
    fireEvent.click(screen.getByTestId("nav-games"));
    expect(screen.getByTestId("games-page")).toBeTruthy();
  });
});
