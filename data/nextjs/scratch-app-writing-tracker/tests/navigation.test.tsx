import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    json: async () => ({ entries: [], projects: [], goals: [] }),
  }));
});

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to entries", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-entries"));
    expect(screen.getByTestId("entries-page")).toBeTruthy();
  });

  it("navigates to goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goals-page")).toBeTruthy();
  });

  it("navigates to settings", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-settings"));
    expect(screen.getByTestId("settings-page")).toBeTruthy();
  });

  it("nav-dashboard button exists", () => {
    render(<App />);
    expect(screen.getByTestId("nav-dashboard")).toBeTruthy();
  });
});
