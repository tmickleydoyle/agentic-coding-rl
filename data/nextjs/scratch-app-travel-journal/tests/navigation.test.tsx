import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to journal page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-journal"));
    expect(screen.getByTestId("journal-page")).toBeTruthy();
  });

  it("navigates to new-entry page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-new-entry"));
    expect(screen.getByTestId("new-entry-page")).toBeTruthy();
  });

  it("navigates to stats page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stats-page")).toBeTruthy();
  });

  it("navigates back to home", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-journal"));
    fireEvent.click(screen.getByTestId("nav-home"));
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });
});
