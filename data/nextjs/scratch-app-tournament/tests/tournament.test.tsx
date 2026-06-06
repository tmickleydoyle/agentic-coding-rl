import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset, recordResult, getMatches } from "../lib/store";
beforeEach(() => { __reset(); cleanup(); });
describe("tournament", () => {
  it("bracket shows 2 seed matches", () => {
    render(<App />);
    expect(screen.getByTestId("bracket-match-1")).toBeTruthy();
    expect(screen.getByTestId("bracket-match-2")).toBeTruthy();
  });
  it("bracket winner empty initially", () => {
    render(<App />);
    expect(screen.getByTestId("bracket-winner-1").textContent).toBe("");
  });
  it("records a valid result", () => {
    const m = recordResult(1, 1);
    expect(m).not.toBeNull();
    expect(m!.winnerId).toBe(1);
  });
  it("rejects invalid winner", () => {
    const m = recordResult(1, 3);
    expect(m).toBeNull();
  });
  it("shows result after recording", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-results"));
    const matchSelect = screen.getByTestId("result-match-select");
    const winnerSelect = screen.getByTestId("result-winner-select");
    fireEvent.change(matchSelect, { target: { value: "1" } });
    fireEvent.change(winnerSelect, { target: { value: "1" } });
    fireEvent.click(screen.getByTestId("record-result-btn"));
    expect(getMatches()[0].winnerId).toBe(1);
  });
});
