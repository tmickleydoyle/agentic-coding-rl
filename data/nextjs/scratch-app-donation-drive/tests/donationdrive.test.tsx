import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

describe("Campaigns Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed campaigns", () => {
    render(<App />);
    expect(screen.getByTestId("campaign-row-c1")).toBeTruthy();
    expect(screen.getByTestId("campaign-row-c2")).toBeTruthy();
  });

  it("shows campaign raised and goal", () => {
    render(<App />);
    expect(screen.getByTestId("campaign-raised-c1").textContent).toBe("3200");
    expect(screen.getByTestId("campaign-goal-c1").textContent).toBe("5000");
  });

  it("shows progress percentage", () => {
    render(<App />);
    expect(screen.getByTestId("campaign-pct-c1").textContent).toBe("64");
  });

  it("Closed campaign has no donate button", () => {
    render(<App />);
    expect(screen.queryByTestId("donate-btn-c2")).toBeNull();
  });

  it("Active campaign has donate button", () => {
    render(<App />);
    expect(screen.getByTestId("donate-btn-c1")).toBeTruthy();
  });
});

describe("Donors Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed donors", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-donors"));
    expect(screen.getByTestId("donor-row-d1")).toBeTruthy();
    expect(screen.getByTestId("donor-row-d3")).toBeTruthy();
  });

  it("adds a donor", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-donors"));
    fireEvent.change(screen.getByTestId("donor-name"), { target: { value: "Dave Park" } });
    fireEvent.click(screen.getByTestId("donor-submit"));
    expect(screen.getByText("Dave Park")).toBeTruthy();
  });
});

describe("Leaderboard Page", () => {
  beforeEach(() => { __reset(); });

  it("shows donors on leaderboard", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-leaderboard"));
    expect(screen.getByTestId("lb-row-d1")).toBeTruthy();
    expect(screen.getByTestId("lb-row-d3")).toBeTruthy();
  });

  it("top donor has rank 1", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-leaderboard"));
    // Carol has 750 (highest), so should be rank 1
    expect(screen.getByTestId("lb-rank-d3").textContent).toBe("1");
  });

  it("shows total donated on leaderboard", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-leaderboard"));
    expect(screen.getByTestId("lb-total-d3").textContent).toBe("750");
  });
});
