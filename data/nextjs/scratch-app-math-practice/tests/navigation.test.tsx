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

  it("navigates to problems", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-problems"));
    expect(screen.getByTestId("problems-page")).toBeTruthy();
  });

  it("navigates to drills", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-drills"));
    expect(screen.getByTestId("drills-page")).toBeTruthy();
  });

  it("navigates to scores", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-scores"));
    expect(screen.getByTestId("scores-page")).toBeTruthy();
  });

  it("home shows problem count", () => {
    render(<App />);
    expect(screen.getByTestId("stat-problems").textContent).toContain("5");
  });
});
