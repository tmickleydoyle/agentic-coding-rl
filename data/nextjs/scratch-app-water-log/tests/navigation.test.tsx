import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("today-cups")).toBeTruthy();
  });

  it("nav buttons exist", () => {
    render(<App />);
    expect(screen.getByTestId("nav-dashboard")).toBeTruthy();
    expect(screen.getByTestId("nav-log-water")).toBeTruthy();
    expect(screen.getByTestId("nav-history")).toBeTruthy();
  });

  it("navigates to log-water", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log-water"));
    expect(screen.getByTestId("log-water-form")).toBeTruthy();
  });

  it("navigates to history", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getAllByTestId("history-date-group").length).toBeGreaterThan(0);
  });
});
