import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders tracker by default", () => {
    render(<App />);
    expect(screen.getByTestId("calories-consumed")).toBeTruthy();
  });

  it("nav buttons exist", () => {
    render(<App />);
    expect(screen.getByTestId("nav-tracker")).toBeTruthy();
    expect(screen.getByTestId("nav-add-food")).toBeTruthy();
    expect(screen.getByTestId("nav-goals")).toBeTruthy();
  });

  it("navigates to add-food", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-food"));
    expect(screen.getByTestId("add-food-form")).toBeTruthy();
  });

  it("navigates to goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goal-calories")).toBeTruthy();
  });
});
