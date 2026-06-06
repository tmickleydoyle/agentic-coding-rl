import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Decision Log Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });
  it("shows log page by default", () => {
    render(<App />);
    expect(screen.getByTestId("log-page")).toBeTruthy();
  });
  it("navigates to archive", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-archive"));
    expect(screen.getByTestId("archive-page")).toBeTruthy();
  });
  it("navigates to filter", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-filter"));
    expect(screen.getByTestId("filter-page")).toBeTruthy();
  });
  it("navigates to stats", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stats-page")).toBeTruthy();
  });
  it("returns to log", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    fireEvent.click(screen.getByTestId("nav-log"));
    expect(screen.getByTestId("log-page")).toBeTruthy();
  });
});
