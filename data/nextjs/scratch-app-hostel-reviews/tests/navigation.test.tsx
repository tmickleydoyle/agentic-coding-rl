import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders home by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to reviews", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reviews"));
    expect(screen.getByTestId("reviews-page")).toBeTruthy();
  });

  it("navigates to add-review", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-review"));
    expect(screen.getByTestId("add-review-page")).toBeTruthy();
  });

  it("navigates to top-rated", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-top-rated"));
    expect(screen.getByTestId("top-rated-page")).toBeTruthy();
  });
});
