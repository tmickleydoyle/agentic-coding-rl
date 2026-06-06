import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows meals by default", () => {
    render(<App />);
    expect(screen.getByTestId("meals-page")).toBeTruthy();
  });

  it("navigates to foods", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-foods"));
    expect(screen.getByTestId("foods-page")).toBeTruthy();
  });

  it("navigates to daily", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-daily"));
    expect(screen.getByTestId("daily-page")).toBeTruthy();
  });

  it("navigates to summary", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("summary-page")).toBeTruthy();
  });
});
