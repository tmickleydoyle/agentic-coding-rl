import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Log page", () => {
  it("renders log form inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    expect(screen.getByTestId("input-level")).toBeTruthy();
    expect(screen.getByTestId("input-note")).toBeTruthy();
    expect(screen.getByTestId("input-activities")).toBeTruthy();
    expect(screen.getByTestId("submit-log")).toBeTruthy();
  });

  it("shows error when submitting empty note", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    fireEvent.click(screen.getByTestId("submit-log"));
    const err = await screen.findByTestId("form-error");
    expect(err).toBeTruthy();
  });
});

describe("Insights page", () => {
  it("shows insight components", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-insights"));
    expect(screen.getByTestId("insight-avg")).toBeTruthy();
    expect(screen.getByTestId("insight-count")).toBeTruthy();
    expect(screen.getByTestId("mood-distribution")).toBeTruthy();
  });
});
