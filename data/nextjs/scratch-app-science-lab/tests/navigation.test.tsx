import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows home by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to experiments", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-experiments"));
    expect(screen.getByTestId("experiments-page")).toBeTruthy();
  });

  it("navigates to equipment", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-equipment"));
    expect(screen.getByTestId("equipment-page")).toBeTruthy();
  });

  it("navigates to results", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-results"));
    expect(screen.getByTestId("results-page")).toBeTruthy();
  });

  it("home shows correct stats", () => {
    render(<App />);
    expect(screen.getByTestId("stat-experiments").textContent).toContain("3");
    expect(screen.getByTestId("stat-running").textContent).toContain("1");
  });
});
