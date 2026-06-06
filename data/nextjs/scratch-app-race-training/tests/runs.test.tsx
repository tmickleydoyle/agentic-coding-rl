import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Runs and Log", () => {
  it("plan page shows race name", () => {
    render(<App />);
    expect(screen.getByTestId("race-name").textContent).toContain("City Marathon");
  });

  it("plan page shows seed run count", () => {
    render(<App />);
    expect(screen.getByTestId("plan-total-runs").textContent).toContain("3");
  });

  it("shows seed runs on runs page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-runs"));
    expect(screen.getByTestId("run-item-r1")).toBeTruthy();
    expect(screen.getByTestId("run-item-r3")).toBeTruthy();
  });

  it("adds a run", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-runs"));
    fireEvent.change(screen.getByTestId("input-run-distance"), { target: { value: "10" } });
    fireEvent.change(screen.getByTestId("input-run-date"), { target: { value: "2024-07-10" } });
    fireEvent.click(screen.getByTestId("btn-add-run"));
    const list = screen.getByTestId("run-list");
    expect(list.querySelectorAll("li").length).toBe(4);
  });

  it("deletes a run", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-runs"));
    fireEvent.click(screen.getByTestId("btn-delete-run-r1"));
    expect(screen.queryByTestId("run-item-r1")).toBeNull();
  });

  it("log shows total km after completing run", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    fireEvent.click(screen.getByTestId("btn-toggle-run-r1"));
    expect(screen.getByTestId("total-km-logged").textContent).toContain("8");
  });

  it("goals page shows default pace goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("current-goal-easy").textContent).toContain("6:00");
  });
});
