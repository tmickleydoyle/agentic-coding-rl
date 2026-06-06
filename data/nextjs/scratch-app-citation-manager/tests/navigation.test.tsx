import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Citation Manager Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows citations page by default", () => {
    render(<App />);
    expect(screen.getByTestId("citations-page")).toBeTruthy();
  });

  it("navigates to collections", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-collections"));
    expect(screen.getByTestId("collections-page")).toBeTruthy();
  });

  it("navigates to export", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-export"));
    expect(screen.getByTestId("export-page")).toBeTruthy();
  });

  it("navigates to search", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-search"));
    expect(screen.getByTestId("search-page")).toBeTruthy();
  });

  it("returns to citations", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-collections"));
    fireEvent.click(screen.getByTestId("nav-citations"));
    expect(screen.getByTestId("citations-page")).toBeTruthy();
  });
});
