import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Dashboard", () => {
  it("shows total saved", () => {
    render(<App />);
    expect(screen.getByTestId("total-saved").textContent).toContain("1550.00");
  });
  it("shows active goals count", () => {
    render(<App />);
    expect(screen.getByTestId("active-goals").textContent).toBe("2");
  });
});

describe("Goals", () => {
  it("lists seed goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goal-g1")).toBeTruthy();
    expect(screen.getByTestId("goal-g2")).toBeTruthy();
  });
  it("adds a new goal", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    fireEvent.change(screen.getByTestId("goal-name"), { target: { value: "Car" } });
    fireEvent.change(screen.getByTestId("goal-target"), { target: { value: "10000" } });
    fireEvent.change(screen.getByTestId("goal-deadline"), { target: { value: "2025-12-31" } });
    fireEvent.click(screen.getByTestId("add-goal-btn"));
    expect(screen.getByText("Car")).toBeTruthy();
  });
  it("deletes a goal", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    fireEvent.click(screen.getByTestId("delete-goal-g1"));
    expect(screen.queryByTestId("goal-g1")).toBeNull();
  });
});

describe("Progress", () => {
  it("shows progress for g1", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    expect(screen.getByTestId("progress-saved-g1").textContent).toContain("1250.00");
  });
  it("shows percentage for g2", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    expect(screen.getByTestId("progress-pct-g2").textContent).toContain("15%");
  });
});
