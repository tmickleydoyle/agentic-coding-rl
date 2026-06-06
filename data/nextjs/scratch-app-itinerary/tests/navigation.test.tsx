import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders home by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to schedule", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-schedule"));
    expect(screen.getByTestId("schedule-page")).toBeTruthy();
  });

  it("navigates to add-activity", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-activity"));
    expect(screen.getByTestId("add-activity-page")).toBeTruthy();
  });

  it("navigates to map-view", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-map-view"));
    expect(screen.getByTestId("map-view-page")).toBeTruthy();
  });
});
