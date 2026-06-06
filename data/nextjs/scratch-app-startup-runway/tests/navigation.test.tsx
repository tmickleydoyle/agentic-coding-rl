import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders the navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to runway page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-runway"));
    expect(screen.getByTestId("runway-page")).toBeTruthy();
  });

  it("navigates to expenses page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    expect(screen.getByTestId("expenses-page")).toBeTruthy();
  });

  it("navigates to projections page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-projections"));
    expect(screen.getByTestId("projections-page")).toBeTruthy();
  });

  it("navigates to settings page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-settings"));
    expect(screen.getByTestId("settings-page")).toBeTruthy();
  });
});
