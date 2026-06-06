import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset, makePick, getPicks, getAvailablePlayers } from "../lib/store";
beforeEach(() => { __reset(); cleanup(); });
describe("draft", () => {
  it("board starts empty", () => {
    render(<App />);
    expect(screen.getByTestId("pick-count").textContent).toBe("0");
  });
  it("makes a valid pick", () => {
    const pick = makePick(1, 1);
    expect(pick).not.toBeNull();
    expect(pick!.pickNumber).toBe(1);
    expect(pick!.teamId).toBe(1);
  });
  it("cannot draft same player twice", () => {
    makePick(1, 1);
    const dup = makePick(2, 1);
    expect(dup).toBeNull();
  });
  it("pick count increments", () => {
    makePick(1, 1);
    makePick(2, 2);
    expect(getPicks().length).toBe(2);
  });
  it("available players decreases after pick", () => {
    const before = getAvailablePlayers().length;
    makePick(1, 1);
    expect(getAvailablePlayers().length).toBe(before - 1);
  });
  it("round computed from pick number and team count", () => {
    const p1 = makePick(1, 1);
    const p2 = makePick(2, 2);
    const p3 = makePick(3, 3);
    const p4 = makePick(1, 4);
    expect(p1!.round).toBe(1);
    expect(p4!.round).toBe(2);
  });
});
