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

  it("navigates to shareholders", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-shareholders"));
    expect(screen.getByTestId("shareholders-page")).toBeTruthy();
  });

  it("navigates to rounds", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-rounds"));
    expect(screen.getByTestId("rounds-page")).toBeTruthy();
  });

  it("navigates to dilution", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-dilution"));
    expect(screen.getByTestId("dilution-page")).toBeTruthy();
  });
});
