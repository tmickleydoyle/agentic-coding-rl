import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });
  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });
  it("navigates to goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goals-page")).toBeTruthy();
  });
  it("navigates to contributions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contributions"));
    expect(screen.getByTestId("contributions-page")).toBeTruthy();
  });
  it("navigates to progress", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    expect(screen.getByTestId("progress-page")).toBeTruthy();
  });
});
