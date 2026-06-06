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
  it("navigates to collection", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-collection"));
    expect(screen.getByTestId("collection-page")).toBeTruthy();
  });
  it("navigates to wishlist", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-wishlist"));
    expect(screen.getByTestId("wishlist-page")).toBeTruthy();
  });
  it("navigates to stats", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stats-page")).toBeTruthy();
  });
  it("navigates back to home", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-collection"));
    fireEvent.click(screen.getByTestId("nav-home"));
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });
});
