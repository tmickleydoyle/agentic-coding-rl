import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Overview", () => {
  it("shows total remaining", () => {
    render(<App />);
    // d1: 3000-200=2800, d2: 8000-300=7700, d3: 15000-0=15000 => 25500
    expect(screen.getByTestId("total-remaining").textContent).toContain("25500.00");
  });
  it("shows total paid", () => {
    render(<App />);
    expect(screen.getByTestId("total-paid").textContent).toContain("500.00");
  });
  it("shows debt count", () => {
    render(<App />);
    expect(screen.getByTestId("debt-count").textContent).toBe("3");
  });
});

describe("Debts", () => {
  it("lists seed debts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-debts"));
    expect(screen.getByTestId("debt-d1")).toBeTruthy();
    expect(screen.getByTestId("debt-d2")).toBeTruthy();
    expect(screen.getByTestId("debt-d3")).toBeTruthy();
  });
  it("adds a debt", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-debts"));
    fireEvent.change(screen.getByTestId("debt-name"), { target: { value: "Medical" } });
    fireEvent.change(screen.getByTestId("debt-balance"), { target: { value: "2000" } });
    fireEvent.change(screen.getByTestId("debt-interest"), { target: { value: "18" } });
    fireEvent.change(screen.getByTestId("debt-minimum"), { target: { value: "50" } });
    fireEvent.click(screen.getByTestId("add-debt-btn"));
    expect(screen.getByText("Medical")).toBeTruthy();
  });
  it("deletes a debt", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-debts"));
    fireEvent.click(screen.getByTestId("delete-debt-d3"));
    expect(screen.queryByTestId("debt-d3")).toBeNull();
  });
});

describe("Strategy", () => {
  it("shows debts ordered by interest rate desc", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-strategy"));
    // d1=22.9% should be priority 1
    expect(screen.getByTestId("strategy-priority-d1").textContent).toBe("1");
  });
  it("shows remaining balance in strategy", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-strategy"));
    expect(screen.getByTestId("strategy-remaining-d1").textContent).toContain("2800.00");
  });
});
