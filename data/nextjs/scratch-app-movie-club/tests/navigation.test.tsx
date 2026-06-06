import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("navigates to watchlist", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-watchlist"));
    expect(screen.getByTestId("watchlist-page")).toBeTruthy();
  });

  it("navigates to reviews", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reviews"));
    expect(screen.getByTestId("reviews-page")).toBeTruthy();
  });

  it("navigates to discover", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-discover"));
    expect(screen.getByTestId("discover-page")).toBeTruthy();
  });

  it("navigates back to home", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-watchlist"));
    fireEvent.click(screen.getByTestId("nav-home"));
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });
});
