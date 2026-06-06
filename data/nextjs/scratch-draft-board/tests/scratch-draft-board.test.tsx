import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Draft Board", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders app title", () => {
    expect(screen.getByTestId("app-title").textContent).toContain("Draft Board");
  });

  it("shows initial pick number as 1", () => {
    expect(screen.getByTestId("current-pick").textContent).toContain("1");
  });

  it("shows initial round as 1", () => {
    expect(screen.getByTestId("current-round").textContent).toContain("1");
  });

  it("renders all 10 available players initially", () => {
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByTestId(`available-player-${i}`)).toBeTruthy();
    }
  });

  it("shows no-picks message before any draft", () => {
    expect(screen.getByTestId("no-picks")).toBeTruthy();
  });

  it("drafting a player removes them from available", () => {
    fireEvent.click(screen.getByTestId("draft-btn-1"));
    expect(screen.queryByTestId("available-player-1")).toBeNull();
  });

  it("drafting a player adds them to picks", () => {
    fireEvent.click(screen.getByTestId("draft-btn-1"));
    expect(screen.getByTestId("pick-1")).toBeTruthy();
    expect(screen.getByTestId("pick-name-1").textContent).toContain("Christian McCaffrey");
  });

  it("increments pick number after drafting", () => {
    fireEvent.click(screen.getByTestId("draft-btn-1"));
    expect(screen.getByTestId("current-pick").textContent).toContain("2");
  });

  it("shows picks count in heading", () => {
    fireEvent.click(screen.getByTestId("draft-btn-1"));
    fireEvent.click(screen.getByTestId("draft-btn-2"));
    expect(screen.getByTestId("picks-heading").textContent).toContain("2");
  });

  it("filters available players by position QB", () => {
    fireEvent.click(screen.getByTestId("filter-qb"));
    expect(screen.getByTestId("available-player-6")).toBeTruthy();
    expect(screen.getByTestId("available-player-7")).toBeTruthy();
    expect(screen.queryByTestId("available-player-1")).toBeNull();
  });

  it("filter-all shows all available players", () => {
    fireEvent.click(screen.getByTestId("filter-qb"));
    fireEvent.click(screen.getByTestId("filter-all"));
    expect(screen.getByTestId("available-player-1")).toBeTruthy();
    expect(screen.getByTestId("available-player-6")).toBeTruthy();
  });

  it("shows ADP for available players", () => {
    expect(screen.getByTestId("avail-adp-1").textContent).toContain("1.2");
  });

  it("shows position badge for available player", () => {
    expect(screen.getByTestId("avail-pos-1").textContent).toBe("RB");
  });

  it("shows rank for available players", () => {
    expect(screen.getByTestId("avail-rank-1").textContent).toContain("1");
  });
});
