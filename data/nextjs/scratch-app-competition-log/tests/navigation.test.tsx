import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows competitions page by default", () => {
    render(<App />);
    expect(screen.getByTestId("competitions-page")).toBeTruthy();
  });

  it("navigates to results", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-results"));
    expect(screen.getByTestId("results-page")).toBeTruthy();
  });

  it("navigates to rankings", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-rankings"));
    expect(screen.getByTestId("rankings-page")).toBeTruthy();
  });

  it("navigates to history", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("history-page")).toBeTruthy();
  });
});
