import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Dashboard", () => {
  it("shows total goals", () => {
    render(<App />);
    expect(screen.getByTestId("total-goals").textContent).toBe("4");
  });
  it("shows completed goals", () => {
    render(<App />);
    expect(screen.getByTestId("completed-goals").textContent).toBe("1");
  });
  it("shows total target", () => {
    render(<App />);
    // 20000+10000+50000+3000 = 83000
    expect(screen.getByTestId("total-target").textContent).toContain("83000.00");
  });
  it("shows total saved", () => {
    render(<App />);
    // 8000+10000+15000+2700 = 35700
    expect(screen.getByTestId("total-saved").textContent).toContain("35700.00");
  });
});

describe("Goals", () => {
  it("lists seed goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goal-fg1")).toBeTruthy();
    expect(screen.getByTestId("goal-fg2")).toBeTruthy();
  });
  it("shows completion pct for fg4", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    // 2700/3000 = 90%
    expect(screen.getByTestId("goal-pct-fg4").textContent).toContain("90%");
  });
  it("adds a goal", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    fireEvent.change(screen.getByTestId("goal-title"), { target: { value: "Laptop" } });
    fireEvent.change(screen.getByTestId("goal-target"), { target: { value: "1500" } });
    fireEvent.click(screen.getByTestId("add-goal-btn"));
    expect(screen.getByText("Laptop")).toBeTruthy();
  });
  it("deletes a goal", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    fireEvent.click(screen.getByTestId("delete-goal-fg3"));
    expect(screen.queryByTestId("goal-fg3")).toBeNull();
  });
});

describe("Milestones", () => {
  it("shows fg2 100% as reached", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-milestones"));
    expect(screen.getByTestId("milestone-reached-fg2-100").textContent).toBe("reached");
  });
  it("shows fg1 25% as reached and 75% as not reached", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-milestones"));
    // fg1: 8000/20000 = 40%, so 25% reached, 50% not reached
    expect(screen.getByTestId("milestone-reached-fg1-25").textContent).toBe("reached");
    expect(screen.getByTestId("milestone-reached-fg1-75").textContent).toBe("not reached");
  });
});

describe("Insights", () => {
  it("shows nearest goal to completion among active", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-insights"));
    // fg4 is 90%, fg1 is 40%, fg3 is 30%
    expect(screen.getByTestId("nearest-goal-title").textContent).toBe("Vacation");
  });
  it("shows purchase category group", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-insights"));
    expect(screen.getByTestId("category-count-purchase").textContent).toBe("2");
  });
});
