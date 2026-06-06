import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Dashboard", () => {
  it("shows 6 cups today from seed data", () => {
    render(<App />);
    expect(screen.getByTestId("today-cups").textContent).toContain("6");
  });

  it("shows daily goal of 8", () => {
    render(<App />);
    expect(screen.getByTestId("daily-goal").textContent).toContain("8");
  });

  it("shows 2 cups remaining", () => {
    render(<App />);
    expect(screen.getByTestId("cups-remaining").textContent).toContain("2");
  });

  it("shows progress text", () => {
    render(<App />);
    expect(screen.getByTestId("progress-text").textContent).toContain("75%");
  });
});

describe("History", () => {
  it("shows 1 date group for seed data", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getAllByTestId("history-date-group").length).toBe(1);
  });

  it("shows 4 water entries", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getAllByTestId("water-entry").length).toBe(4);
  });

  it("delete removes entry", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    fireEvent.click(screen.getByTestId("delete-entry-w1"));
    expect(screen.getAllByTestId("water-entry").length).toBe(3);
  });
});

describe("Log Water", () => {
  it("adds entry and updates dashboard", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log-water"));
    fireEvent.change(screen.getByTestId("input-cups"), { target: { value: "2" } });
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("today-cups").textContent).toContain("8");
  });
});
