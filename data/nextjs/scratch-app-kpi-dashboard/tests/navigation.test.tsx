import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows overview by default", () => {
    render(<App />);
    expect(screen.getByTestId("overview-page")).toBeTruthy();
  });

  it("navigates to metrics", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-metrics"));
    expect(screen.getByTestId("metrics-page")).toBeTruthy();
  });

  it("navigates to goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goals-page")).toBeTruthy();
  });

  it("navigates to history", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("history-page")).toBeTruthy();
  });
});
