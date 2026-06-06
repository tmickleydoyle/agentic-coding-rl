import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("navigation", () => {
  it("renders the navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to expenses page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    expect(screen.getByTestId("expenses-page")).toBeTruthy();
  });

  it("navigates to roommates page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-roommates"));
    expect(screen.getByTestId("roommates-page")).toBeTruthy();
  });

  it("navigates to settle page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-settle"));
    expect(screen.getByTestId("settle-page")).toBeTruthy();
  });

  it("navigates to history page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("history-page")).toBeTruthy();
  });
});
