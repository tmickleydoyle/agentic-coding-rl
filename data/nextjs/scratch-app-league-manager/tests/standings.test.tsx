import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset, getStandings } from "../lib/store";

beforeEach(() => { __reset(); cleanup(); });

describe("standings", () => {
  it("shows standings table", () => {
    render(<App />);
    expect(screen.getByTestId("standings-table")).toBeTruthy();
  });

  it("Red Lions have 3 points (1 win, 1 draw)", () => {
    render(<App />);
    expect(screen.getByTestId("standing-points-1").textContent).toBe("4");
  });

  it("Green Hawks have 1 point (1 draw)", () => {
    render(<App />);
    expect(screen.getByTestId("standing-points-3").textContent).toBe("1");
  });

  it("Blue Eagles have 0 points (1 loss)", () => {
    render(<App />);
    expect(screen.getByTestId("standing-points-2").textContent).toBe("0");
  });

  it("standings sorted by points desc", () => {
    const standings = getStandings();
    expect(standings[0].teamId).toBe(1);
    expect(standings[1].teamId).toBe(3);
    expect(standings[2].teamId).toBe(2);
  });
});
