import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Log page", () => {
  it("renders all form inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    expect(screen.getByTestId("input-date")).toBeTruthy();
    expect(screen.getByTestId("input-steps")).toBeTruthy();
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

describe("Goals page", () => {
  it("renders goal form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("input-target")).toBeTruthy();
    expect(screen.getByTestId("save-goal")).toBeTruthy();
    expect(screen.getByTestId("current-goal")).toBeTruthy();
  });
});
