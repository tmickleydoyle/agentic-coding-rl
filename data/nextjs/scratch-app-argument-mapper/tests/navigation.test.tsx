import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Argument Mapper Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });
  it("shows view page by default", () => {
    render(<App />);
    expect(screen.getByTestId("view-page")).toBeTruthy();
  });
  it("navigates to manage", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-manage"));
    expect(screen.getByTestId("manage-page")).toBeTruthy();
  });
  it("navigates to filter", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-filter"));
    expect(screen.getByTestId("filter-page")).toBeTruthy();
  });
  it("returns to view", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-manage"));
    fireEvent.click(screen.getByTestId("nav-view"));
    expect(screen.getByTestId("view-page")).toBeTruthy();
  });
});
