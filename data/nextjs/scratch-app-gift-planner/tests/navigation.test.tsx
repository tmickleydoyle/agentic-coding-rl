import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to gifts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-gifts"));
    expect(screen.getByTestId("gifts-page")).toBeTruthy();
  });

  it("navigates to occasions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-occasions"));
    expect(screen.getByTestId("occasions-page")).toBeTruthy();
  });

  it("navigates to budget", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-budget"));
    expect(screen.getByTestId("budget-page")).toBeTruthy();
  });

  it("navigates to ideas", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-ideas"));
    expect(screen.getByTestId("ideas-page")).toBeTruthy();
  });
});
