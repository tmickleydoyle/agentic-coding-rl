import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("shows profiles page by default", () => {
    render(<App />);
    expect(screen.getByTestId("profiles-page")).toBeTruthy();
  });

  it("has all nav links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-profiles")).toBeTruthy();
    expect(screen.getByTestId("nav-allocations")).toBeTruthy();
    expect(screen.getByTestId("nav-report")).toBeTruthy();
  });

  it("navigates to allocations", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-allocations"));
    expect(screen.getByTestId("allocations-page")).toBeTruthy();
  });

  it("navigates to report", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-report"));
    expect(screen.getByTestId("report-page")).toBeTruthy();
  });
});
