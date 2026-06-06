import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); cleanup(); });

describe("navigation", () => {
  it("renders standings by default", () => {
    render(<App />);
    expect(screen.getByTestId("standings-page")).toBeTruthy();
  });

  it("navigates to teams", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-teams"));
    expect(screen.getByTestId("teams-page")).toBeTruthy();
  });

  it("navigates to schedule", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-schedule"));
    expect(screen.getByTestId("schedule-page")).toBeTruthy();
  });

  it("navigates back to standings", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-teams"));
    fireEvent.click(screen.getByTestId("nav-standings"));
    expect(screen.getByTestId("standings-page")).toBeTruthy();
  });
});
