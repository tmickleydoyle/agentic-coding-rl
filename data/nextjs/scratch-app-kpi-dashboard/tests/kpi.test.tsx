import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("KPI Dashboard", () => {
  it("shows seed KPIs on overview", () => {
    render(<App />);
    expect(screen.getByTestId("kpi-card-1")).toBeTruthy();
    expect(screen.getByTestId("kpi-card-2")).toBeTruthy();
  });

  it("formats currency value with dollar sign", () => {
    render(<App />);
    expect(screen.getByTestId("kpi-value-1").textContent).toContain("$");
  });

  it("formats percent value with % sign", () => {
    render(<App />);
    expect(screen.getByTestId("kpi-value-2").textContent).toContain("%");
  });

  it("adds a metric", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-metrics"));
    fireEvent.change(screen.getByTestId("metric-name-input"), { target: { value: "CAC" } });
    fireEvent.change(screen.getByTestId("metric-current-input"), { target: { value: "200" } });
    fireEvent.change(screen.getByTestId("metric-target-input"), { target: { value: "150" } });
    fireEvent.click(screen.getByTestId("add-metric-btn"));
    expect(screen.getByText("CAC")).toBeTruthy();
  });

  it("shows no-history message when history empty", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("no-history")).toBeTruthy();
  });

  it("adds a history entry", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    fireEvent.change(screen.getByTestId("history-metric-select"), { target: { value: "1" } });
    fireEvent.change(screen.getByTestId("history-value-input"), { target: { value: "46000" } });
    fireEvent.change(screen.getByTestId("history-date-input"), { target: { value: "2024-03-01" } });
    fireEvent.click(screen.getByTestId("add-history-btn"));
    expect(screen.getByTestId("history-list")).toBeTruthy();
  });
});
