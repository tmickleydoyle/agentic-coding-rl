import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset, getFlags, getReports } from "../lib/store";
beforeEach(() => { __reset(); cleanup(); });
describe("flags", () => {
  it("shows 3 seed flags", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-flags"));
    expect(screen.getByTestId("flag-item-1")).toBeTruthy();
    expect(screen.getByTestId("flag-item-2")).toBeTruthy();
    expect(screen.getByTestId("flag-item-3")).toBeTruthy();
  });
  it("reports show correct flag counts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("report-flags-1").textContent).toBe("2");
    expect(screen.getByTestId("report-flags-2").textContent).toBe("1");
  });
  it("reports show red card count for match 1", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("report-reds-1").textContent).toBe("1");
  });
  it("rejects flag with invalid minute", () => {
    const { addFlag } = require("../lib/store");
    expect(addFlag(1, 91, "foul", "test")).toBeNull();
    expect(addFlag(1, 0, "foul", "test")).toBeNull();
  });
});
