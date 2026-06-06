import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Log page form", () => {
  it("renders all inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    expect(screen.getByTestId("input-weight")).toBeTruthy();
    expect(screen.getByTestId("input-unit")).toBeTruthy();
    expect(screen.getByTestId("input-note")).toBeTruthy();
    expect(screen.getByTestId("submit-log")).toBeTruthy();
  });

  it("shows error on invalid weight submit", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    fireEvent.click(screen.getByTestId("submit-log"));
    const err = await screen.findByTestId("form-error");
    expect(err).toBeTruthy();
  });
});

describe("Stats page", () => {
  it("renders stats page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stats-page")).toBeTruthy();
  });
});
