import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";
beforeEach(() => { __reset(); cleanup(); });
describe("navigation", () => {
  it("renders bracket by default", () => {
    render(<App />);
    expect(screen.getByTestId("bracket-page")).toBeTruthy();
  });
  it("navigates to players", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-players"));
    expect(screen.getByTestId("players-page")).toBeTruthy();
  });
  it("navigates to results", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-results"));
    expect(screen.getByTestId("results-page")).toBeTruthy();
  });
});
