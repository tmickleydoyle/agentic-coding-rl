import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows sessions by default", () => {
    render(<App />);
    expect(screen.getByTestId("sessions-page")).toBeTruthy();
  });

  it("navigates to exercises", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-exercises"));
    expect(screen.getByTestId("exercises-page")).toBeTruthy();
  });

  it("navigates to history", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("history-page")).toBeTruthy();
  });

  it("navigates to stats", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stats-page")).toBeTruthy();
  });
});
