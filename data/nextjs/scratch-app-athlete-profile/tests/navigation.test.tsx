import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows profile page by default", () => {
    render(<App />);
    expect(screen.getByTestId("profile-page")).toBeTruthy();
  });

  it("navigates to metrics", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-metrics"));
    expect(screen.getByTestId("metrics-page")).toBeTruthy();
  });

  it("navigates to events", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    expect(screen.getByTestId("events-page")).toBeTruthy();
  });

  it("navigates to achievements", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-achievements"));
    expect(screen.getByTestId("achievements-page")).toBeTruthy();
  });
});
