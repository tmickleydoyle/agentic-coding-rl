import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("League Standings", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders app title", () => {
    expect(screen.getByTestId("app-title").textContent).toContain("League Standings");
  });

  it("renders all 8 team rows", () => {
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByTestId(`team-row-${i}`)).toBeTruthy();
    }
  });

  it("team 1 is ranked first by default (most wins)", () => {
    expect(screen.getByTestId("team-rank-1").textContent).toBe("1");
  });

  it("shows team name for team 1", () => {
    expect(screen.getByTestId("team-name-1").textContent).toContain("Thunder Hawks");
  });

  it("shows manager for team 1", () => {
    expect(screen.getByTestId("team-manager-1").textContent).toContain("Alice");
  });

  it("shows wins for team 1", () => {
    expect(screen.getByTestId("team-wins-1").textContent).toBe("7");
  });

  it("shows points for with one decimal for team 1", () => {
    expect(screen.getByTestId("team-pf-1").textContent).toBe("1245.6");
  });

  it("shows streak for team 1", () => {
    expect(screen.getByTestId("team-streak-1").textContent).toBe("W3");
  });

  it("renders playoff picture section", () => {
    expect(screen.getByTestId("playoff-heading")).toBeTruthy();
  });

  it("shows 4 playoff teams", () => {
    expect(screen.getByTestId("playoff-team-1")).toBeTruthy();
    expect(screen.getByTestId("playoff-team-2")).toBeTruthy();
    expect(screen.getByTestId("playoff-team-3")).toBeTruthy();
    expect(screen.getByTestId("playoff-team-4")).toBeTruthy();
  });

  it("playoff team 1 is Thunder Hawks by default", () => {
    expect(screen.getByTestId("playoff-name-1").textContent).toContain("Thunder Hawks");
  });

  it("sorting by losses ascending re-orders teams", () => {
    fireEvent.click(screen.getByTestId("sort-losses"));
    // ascending sort: team with fewest losses first = Thunder Hawks (2)
    expect(screen.getByTestId("team-rank-1").textContent).toBe("1");
    expect(screen.getByTestId("team-name-1").textContent).toContain("Thunder Hawks");
  });

  it("clicking same sort column toggles direction", () => {
    // default is wins desc; click once => still wins but toggles
    const header = screen.getByTestId("sort-wins");
    fireEvent.click(header);
    // now ascending: fewest wins first (Fumble Factory with 2)
    expect(screen.getByTestId("team-name-8").textContent).toContain("Thunder Hawks");
  });

  it("shows points against for team 8", () => {
    expect(screen.getByTestId("team-pa-8").textContent).toBe("1245.6");
  });
});
