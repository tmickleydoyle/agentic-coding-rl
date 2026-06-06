import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Action Items Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });
  it("shows items page by default", () => {
    render(<App />);
    expect(screen.getByTestId("items-page")).toBeTruthy();
  });
  it("navigates to completed", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-completed"));
    expect(screen.getByTestId("completed-page")).toBeTruthy();
  });
  it("navigates to filter", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-filter"));
    expect(screen.getByTestId("filter-page")).toBeTruthy();
  });
  it("returns to items", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-completed"));
    fireEvent.click(screen.getByTestId("nav-items"));
    expect(screen.getByTestId("items-page")).toBeTruthy();
  });
});
