import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset, getGoals } from "../lib/store";

beforeEach(() => { __reset(); cleanup(); });

describe("goals", () => {
  it("shows seed goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goal-title-1").textContent).toBe("Squat 100kg");
    expect(screen.getByTestId("goal-title-2").textContent).toBe("Run 5km");
  });

  it("shows completed count 0 initially", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("completed-count").textContent).toBe("0");
  });

  it("toggles a goal complete", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    fireEvent.click(screen.getByTestId("toggle-goal-1"));
    expect(screen.getByTestId("goal-completed-1").textContent).toBe("true");
    expect(screen.getByTestId("completed-count").textContent).toBe("1");
  });

  it("adds a new goal", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    fireEvent.change(screen.getByTestId("goal-title-input"), { target: { value: "Deadlift 120kg" } });
    fireEvent.change(screen.getByTestId("goal-target-input"), { target: { value: "120" } });
    fireEvent.change(screen.getByTestId("goal-unit-input"), { target: { value: "kg" } });
    fireEvent.change(screen.getByTestId("goal-deadline-input"), { target: { value: "2024-12-01" } });
    fireEvent.click(screen.getByTestId("add-goal-btn"));
    expect(getGoals().length).toBe(3);
    expect(screen.getByTestId("total-goals").textContent).toBe("3");
  });
});
