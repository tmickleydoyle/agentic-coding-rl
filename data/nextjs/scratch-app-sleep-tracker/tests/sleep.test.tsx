import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Log page", () => {
  it("renders all form inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    expect(screen.getByTestId("input-date")).toBeTruthy();
    expect(screen.getByTestId("input-bedtime")).toBeTruthy();
    expect(screen.getByTestId("input-wake-time")).toBeTruthy();
    expect(screen.getByTestId("input-quality")).toBeTruthy();
    expect(screen.getByTestId("input-notes")).toBeTruthy();
    expect(screen.getByTestId("submit-log")).toBeTruthy();
  });

  it("shows error on empty submit", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    fireEvent.click(screen.getByTestId("submit-log"));
    const err = await screen.findByTestId("form-error");
    expect(err).toBeTruthy();
  });
});

describe("Insights page", () => {
  it("renders insights page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-insights"));
    expect(screen.getByTestId("insights-page")).toBeTruthy();
  });
});
