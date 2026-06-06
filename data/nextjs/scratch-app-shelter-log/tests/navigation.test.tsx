import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders residents by default", () => {
    render(<App />);
    expect(screen.getByTestId("residents-page")).toBeTruthy();
  });
  it("navigates to beds", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-beds"));
    expect(screen.getByTestId("beds-page")).toBeTruthy();
  });
  it("navigates to services", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-services"));
    expect(screen.getByTestId("services-page")).toBeTruthy();
  });
});
