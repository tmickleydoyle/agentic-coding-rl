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

  it("navigates to reading list page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reading-list"));
    expect(screen.getByTestId("reading-list-page")).toBeTruthy();
  });

  it("navigates to stats page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stats-page")).toBeTruthy();
  });

  it("navigates to discover page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-discover"));
    expect(screen.getByTestId("discover-page")).toBeTruthy();
  });

  it("navigates back to home", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reading-list"));
    fireEvent.click(screen.getByTestId("nav-home"));
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });
});
