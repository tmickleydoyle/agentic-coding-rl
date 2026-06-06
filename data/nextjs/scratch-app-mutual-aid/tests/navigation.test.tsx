import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("shows requests page by default", () => {
    render(<App />);
    expect(screen.getByTestId("requests-page")).toBeTruthy();
  });
  it("navigates to offers", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-offers"));
    expect(screen.getByTestId("offers-page")).toBeTruthy();
  });
  it("navigates to matches", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-matches"));
    expect(screen.getByTestId("matches-page")).toBeTruthy();
  });
});
