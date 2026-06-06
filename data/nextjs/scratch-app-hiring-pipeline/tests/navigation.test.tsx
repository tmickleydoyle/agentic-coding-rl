import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to jobs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-jobs"));
    expect(screen.getByTestId("jobs-page")).toBeTruthy();
  });

  it("navigates to candidates", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-candidates"));
    expect(screen.getByTestId("candidates-page")).toBeTruthy();
  });

  it("navigates to interviews", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-interviews"));
    expect(screen.getByTestId("interviews-page")).toBeTruthy();
  });
});
