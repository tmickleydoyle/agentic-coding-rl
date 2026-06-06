import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders weekly plan by default", () => {
    render(<App />);
    expect(screen.getByTestId("total-meals")).toBeTruthy();
  });

  it("nav buttons exist", () => {
    render(<App />);
    expect(screen.getByTestId("nav-weekly-plan")).toBeTruthy();
    expect(screen.getByTestId("nav-add-meal")).toBeTruthy();
  });

  it("navigates to add-meal", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-meal"));
    expect(screen.getByTestId("add-meal-form")).toBeTruthy();
  });

  it("navigates back to weekly plan", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-meal"));
    fireEvent.click(screen.getByTestId("nav-weekly-plan"));
    expect(screen.getByTestId("total-meals")).toBeTruthy();
  });
});
