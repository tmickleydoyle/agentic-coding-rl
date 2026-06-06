import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("shows register page by default", () => {
    render(<App />);
    expect(screen.getByTestId("register-page")).toBeTruthy();
  });

  it("has all nav links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-register")).toBeTruthy();
    expect(screen.getByTestId("nav-valuations")).toBeTruthy();
    expect(screen.getByTestId("nav-summary")).toBeTruthy();
  });

  it("navigates to valuations", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-valuations"));
    expect(screen.getByTestId("valuations-page")).toBeTruthy();
  });

  it("navigates to summary", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("summary-page")).toBeTruthy();
  });
});
