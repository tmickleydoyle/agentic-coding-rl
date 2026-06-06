import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders home by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to expenses", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    expect(screen.getByTestId("expenses-page")).toBeTruthy();
  });

  it("navigates to add-expense", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-expense"));
    expect(screen.getByTestId("add-expense-page")).toBeTruthy();
  });

  it("navigates to summary", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("summary-page")).toBeTruthy();
  });
});
