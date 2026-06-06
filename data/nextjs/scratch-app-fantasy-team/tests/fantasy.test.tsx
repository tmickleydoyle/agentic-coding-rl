import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset, getRoster, getWaivers, addToRoster, dropFromRoster, getStandings } from "../lib/store";
beforeEach(() => { __reset(); cleanup(); });
describe("fantasy team", () => {
  it("roster shows 3 seed players", () => {
    render(<App />);
    expect(screen.getByTestId("roster-count").textContent).toBe("3");
  });
  it("waivers shows 2 players", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-waivers"));
    expect(screen.getByTestId("waiver-item-4")).toBeTruthy();
    expect(screen.getByTestId("waiver-item-5")).toBeTruthy();
  });
  it("adds player from waivers", () => {
    addToRoster(4);
    expect(getRoster().length).toBe(4);
    expect(getWaivers().length).toBe(1);
  });
  it("drops player from roster", () => {
    dropFromRoster(1);
    expect(getRoster().length).toBe(2);
  });
  it("standings sorted by wins desc", () => {
    const s = getStandings();
    expect(s[0].teamName).toBe("My Team");
    expect(s[1].wins).toBeLessThanOrEqual(s[0].wins);
  });
  it("standings rank 1 is My Team", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-standings"));
    expect(screen.getByTestId("standing-rank-1").textContent).toBe("1");
    expect(screen.getByTestId("standing-name-1").textContent).toBe("My Team");
  });
});
