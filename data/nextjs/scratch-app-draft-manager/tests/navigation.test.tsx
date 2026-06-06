import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";
beforeEach(() => { __reset(); cleanup(); });
describe("navigation", () => {
  it("renders board by default", () => {
    render(<App />);
    expect(screen.getByTestId("board-page")).toBeTruthy();
  });
  it("navigates to picks", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-picks"));
    expect(screen.getByTestId("picks-page")).toBeTruthy();
  });
  it("navigates to teams", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-teams"));
    expect(screen.getByTestId("teams-page")).toBeTruthy();
  });
});
