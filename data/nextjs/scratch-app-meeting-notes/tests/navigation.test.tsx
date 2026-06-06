import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Meeting Notes Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });
  it("shows meetings page by default", () => {
    render(<App />);
    expect(screen.getByTestId("meetings-page")).toBeTruthy();
  });
  it("navigates to agenda", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-agenda"));
    expect(screen.getByTestId("agenda-page")).toBeTruthy();
  });
  it("navigates to search", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-search"));
    expect(screen.getByTestId("search-page")).toBeTruthy();
  });
  it("returns to meetings", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-search"));
    fireEvent.click(screen.getByTestId("nav-meetings"));
    expect(screen.getByTestId("meetings-page")).toBeTruthy();
  });
});
