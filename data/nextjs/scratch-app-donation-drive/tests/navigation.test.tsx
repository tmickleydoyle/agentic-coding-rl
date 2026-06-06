import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders campaigns by default", () => {
    render(<App />);
    expect(screen.getByTestId("campaigns-page")).toBeTruthy();
  });
  it("navigates to donors", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-donors"));
    expect(screen.getByTestId("donors-page")).toBeTruthy();
  });
  it("navigates to leaderboard", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-leaderboard"));
    expect(screen.getByTestId("leaderboard-page")).toBeTruthy();
  });
});
