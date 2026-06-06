import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to transactions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-transactions"));
    expect(screen.getByTestId("transactions-page")).toBeTruthy();
  });

  it("navigates to categories", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-categories"));
    expect(screen.getByTestId("categories-page")).toBeTruthy();
  });

  it("navigates to forecast", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-forecast"));
    expect(screen.getByTestId("forecast-page")).toBeTruthy();
  });
});
