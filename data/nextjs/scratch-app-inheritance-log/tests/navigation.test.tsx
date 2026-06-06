import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("shows entries page by default", () => {
    render(<App />);
    expect(screen.getByTestId("entries-page")).toBeTruthy();
  });

  it("has all nav links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-entries")).toBeTruthy();
    expect(screen.getByTestId("nav-heirs")).toBeTruthy();
    expect(screen.getByTestId("nav-timeline")).toBeTruthy();
  });

  it("navigates to heirs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-heirs"));
    expect(screen.getByTestId("heirs-page")).toBeTruthy();
  });

  it("navigates to timeline", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-timeline"));
    expect(screen.getByTestId("timeline-page")).toBeTruthy();
  });
});
