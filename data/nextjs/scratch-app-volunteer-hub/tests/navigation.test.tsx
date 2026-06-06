import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders volunteers page by default", () => {
    render(<App />);
    expect(screen.getByTestId("volunteers-page")).toBeTruthy();
  });

  it("navigates to assignments page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assignments"));
    expect(screen.getByTestId("assignments-page")).toBeTruthy();
  });

  it("navigates to reports page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("reports-page")).toBeTruthy();
  });

  it("navbar is always visible", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });
});
