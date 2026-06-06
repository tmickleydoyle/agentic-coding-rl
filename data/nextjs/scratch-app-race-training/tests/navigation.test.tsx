import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows plan page by default", () => {
    render(<App />);
    expect(screen.getByTestId("plan-page")).toBeTruthy();
  });

  it("navigates to runs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-runs"));
    expect(screen.getByTestId("runs-page")).toBeTruthy();
  });

  it("navigates to goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goals-page")).toBeTruthy();
  });

  it("navigates to log", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    expect(screen.getByTestId("log-page")).toBeTruthy();
  });
});
