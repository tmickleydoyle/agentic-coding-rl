import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Fantasy League Manager", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByTestId("app-title")).toBeTruthy();
  });

  it("shows roster heading with initial player count", () => {
    const heading = screen.getByTestId("roster-heading");
    expect(heading.textContent).toContain("5");
  });

  it("shows initial total points for roster", () => {
    const totalEl = screen.getByTestId("total-points");
    // 342+278+265+301+289 = 1475
    expect(totalEl.textContent).toContain("1475");
  });

  it("renders all 5 roster players", () => {
    expect(screen.getByTestId("roster-player-1")).toBeTruthy();
    expect(screen.getByTestId("roster-player-2")).toBeTruthy();
    expect(screen.getByTestId("roster-player-3")).toBeTruthy();
    expect(screen.getByTestId("roster-player-4")).toBeTruthy();
    expect(screen.getByTestId("roster-player-5")).toBeTruthy();
  });

  it("renders all 4 free agents", () => {
    expect(screen.getByTestId("fa-player-6")).toBeTruthy();
    expect(screen.getByTestId("fa-player-7")).toBeTruthy();
    expect(screen.getByTestId("fa-player-8")).toBeTruthy();
    expect(screen.getByTestId("fa-player-9")).toBeTruthy();
  });

  it("shows position badges for roster players", () => {
    expect(screen.getByTestId("position-badge-1").textContent).toBe("QB");
    expect(screen.getByTestId("position-badge-2").textContent).toBe("RB");
  });

  it("drops a player from roster to free agents", () => {
    fireEvent.click(screen.getByTestId("drop-btn-1"));
    expect(screen.queryByTestId("roster-player-1")).toBeNull();
    expect(screen.getByTestId("fa-player-1")).toBeTruthy();
  });

  it("updates total points after dropping a player", () => {
    fireEvent.click(screen.getByTestId("drop-btn-1")); // drop Mahomes (342)
    const totalEl = screen.getByTestId("total-points");
    expect(totalEl.textContent).toContain("1133");
  });

  it("updates roster heading count after dropping a player", () => {
    fireEvent.click(screen.getByTestId("drop-btn-2"));
    const heading = screen.getByTestId("roster-heading");
    expect(heading.textContent).toContain("4");
  });

  it("adds a free agent to the roster", () => {
    fireEvent.click(screen.getByTestId("add-btn-6"));
    expect(screen.getByTestId("roster-player-6")).toBeTruthy();
    expect(screen.queryByTestId("fa-player-6")).toBeNull();
  });

  it("updates total points after adding a free agent", () => {
    fireEvent.click(screen.getByTestId("add-btn-6")); // add Josh Allen (330)
    const totalEl = screen.getByTestId("total-points");
    expect(totalEl.textContent).toContain("1805");
  });

  it("shows empty roster message when all players dropped", () => {
    fireEvent.click(screen.getByTestId("drop-btn-1"));
    fireEvent.click(screen.getByTestId("drop-btn-2"));
    fireEvent.click(screen.getByTestId("drop-btn-3"));
    fireEvent.click(screen.getByTestId("drop-btn-4"));
    fireEvent.click(screen.getByTestId("drop-btn-5"));
    expect(screen.getByTestId("empty-roster")).toBeTruthy();
  });

  it("shows player name and team for free agents", () => {
    expect(screen.getByTestId("fa-player-name-6").textContent).toContain("Josh Allen");
    expect(screen.getByTestId("fa-player-team-6").textContent).toContain("BUF");
  });

  it("shows player points for roster players", () => {
    expect(screen.getByTestId("player-points-4").textContent).toContain("301");
  });
});
