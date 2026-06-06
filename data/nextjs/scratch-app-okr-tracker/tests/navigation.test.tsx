import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("OKR Tracker Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });
  it("shows objectives page by default", () => {
    render(<App />);
    expect(screen.getByTestId("objectives-page")).toBeTruthy();
  });
  it("navigates to key results", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-keyresults"));
    expect(screen.getByTestId("keyresults-page")).toBeTruthy();
  });
  it("navigates to progress", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    expect(screen.getByTestId("progress-page")).toBeTruthy();
  });
  it("returns to objectives", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    fireEvent.click(screen.getByTestId("nav-objectives"));
    expect(screen.getByTestId("objectives-page")).toBeTruthy();
  });
});
