import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to trips page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trips"));
    expect(screen.getByTestId("trips-page")).toBeTruthy();
  });

  it("navigates to new-trip page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-new-trip"));
    expect(screen.getByTestId("new-trip-page")).toBeTruthy();
  });

  it("navigates to calendar page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-calendar"));
    expect(screen.getByTestId("calendar-page")).toBeTruthy();
  });
});
