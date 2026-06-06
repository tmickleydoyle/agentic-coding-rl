import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";
beforeEach(() => { __reset(); cleanup(); });
describe("navigation", () => {
  it("renders roster by default", () => {
    render(<App />);
    expect(screen.getByTestId("roster-page")).toBeTruthy();
  });
  it("navigates to waivers", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-waivers"));
    expect(screen.getByTestId("waivers-page")).toBeTruthy();
  });
  it("navigates to standings", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-standings"));
    expect(screen.getByTestId("standings-page")).toBeTruthy();
  });
  it("navigates back to roster", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-standings"));
    fireEvent.click(screen.getByTestId("nav-roster"));
    expect(screen.getByTestId("roster-page")).toBeTruthy();
  });
});
