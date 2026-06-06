import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders the app with navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to expenses page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    expect(screen.getByTestId("expenses-page")).toBeTruthy();
  });

  it("navigates to income page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-income"));
    expect(screen.getByTestId("income-page")).toBeTruthy();
  });

  it("navigates to reports page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("reports-page")).toBeTruthy();
  });

  it("navigates back to home", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    fireEvent.click(screen.getByTestId("nav-home"));
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });
});
