import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

function goToWorkouts() {
  render(<App />);
  fireEvent.click(screen.getByTestId("nav-workouts"));
}

describe("Workouts", () => {
  it("shows seed workouts", () => {
    goToWorkouts();
    expect(screen.getByTestId("workout-item-w1")).toBeTruthy();
    expect(screen.getByTestId("workout-item-w2")).toBeTruthy();
    expect(screen.getByTestId("workout-item-w3")).toBeTruthy();
  });

  it("adds a new workout", () => {
    goToWorkouts();
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Evening Walk" } });
    fireEvent.change(screen.getByTestId("input-duration"), { target: { value: "40" } });
    fireEvent.click(screen.getByTestId("btn-add-workout"));
    expect(screen.getByText("Evening Walk")).toBeTruthy();
  });

  it("clears form after add", () => {
    goToWorkouts();
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Swim" } });
    fireEvent.change(screen.getByTestId("input-duration"), { target: { value: "30" } });
    fireEvent.click(screen.getByTestId("btn-add-workout"));
    expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe("");
  });

  it("removes a workout", () => {
    goToWorkouts();
    fireEvent.click(screen.getByTestId("btn-remove-w1"));
    expect(screen.queryByTestId("workout-item-w1")).toBeNull();
  });

  it("toggles complete", () => {
    goToWorkouts();
    fireEvent.click(screen.getByTestId("btn-complete-w1"));
    expect(screen.getByTestId("workout-completed-w1").textContent).toBe("done");
  });

  it("dashboard reflects completed count", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-workouts"));
    fireEvent.click(screen.getByTestId("btn-complete-w2"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    expect(screen.getByTestId("stat-completed").textContent).toContain("1");
  });
});
