import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows injuries page by default", () => {
    render(<App />);
    expect(screen.getByTestId("injuries-page")).toBeTruthy();
  });

  it("navigates to treatment", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-treatment"));
    expect(screen.getByTestId("treatment-page")).toBeTruthy();
  });

  it("navigates to timeline", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-timeline"));
    expect(screen.getByTestId("timeline-page")).toBeTruthy();
  });

  it("navigates to notes", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-notes"));
    expect(screen.getByTestId("notes-page")).toBeTruthy();
  });
});
