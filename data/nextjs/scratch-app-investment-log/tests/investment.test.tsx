import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Portfolio", () => {
  it("shows total invested", () => {
    render(<App />);
    // AAPL: 10*150=1500, MSFT: 5*280=1400, GOOGL: 2*2800=5600 => 8500
    expect(screen.getByTestId("total-invested").textContent).toContain("8500.00");
  });
  it("shows current value", () => {
    render(<App />);
    // AAPL: 10*180=1800, MSFT: 5*310=1550, GOOGL: 2*2650=5300 => 8650
    expect(screen.getByTestId("current-value").textContent).toContain("8650.00");
  });
  it("shows gain/loss", () => {
    render(<App />);
    // 8650 - 8500 = 150
    expect(screen.getByTestId("gain-loss").textContent).toContain("150.00");
  });
});

describe("Holdings", () => {
  it("lists seed holdings", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-holdings"));
    expect(screen.getByTestId("holding-h1")).toBeTruthy();
    expect(screen.getByTestId("holding-h2")).toBeTruthy();
    expect(screen.getByTestId("holding-h3")).toBeTruthy();
  });
  it("adds a holding", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-holdings"));
    fireEvent.change(screen.getByTestId("holding-ticker"), { target: { value: "TSLA" } });
    fireEvent.change(screen.getByTestId("holding-shares"), { target: { value: "3" } });
    fireEvent.change(screen.getByTestId("holding-avg-price"), { target: { value: "200" } });
    fireEvent.change(screen.getByTestId("holding-current-price"), { target: { value: "250" } });
    fireEvent.click(screen.getByTestId("add-holding-btn"));
    expect(screen.getByText("TSLA")).toBeTruthy();
  });
  it("deletes a holding", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-holdings"));
    fireEvent.click(screen.getByTestId("delete-holding-h3"));
    expect(screen.queryByTestId("holding-h3")).toBeNull();
  });
});

describe("Performance", () => {
  it("shows AAPL gain pct", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-performance"));
    // (180-150)/150*100 = 20%
    expect(screen.getByTestId("perf-gain-pct-h1").textContent).toContain("20.00%");
  });
  it("shows GOOGL negative gain", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-performance"));
    expect(screen.getByTestId("perf-total-gain-h3").textContent).toContain("-300.00");
  });
});
