import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows athletes page by default", () => {
    render(<App />);
    expect(screen.getByTestId("athletes-page")).toBeTruthy();
  });

  it("navigates to sessions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-sessions"));
    expect(screen.getByTestId("sessions-page")).toBeTruthy();
  });

  it("navigates to drills", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-drills"));
    expect(screen.getByTestId("drills-page")).toBeTruthy();
  });

  it("navigates to review", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-review"));
    expect(screen.getByTestId("review-page")).toBeTruthy();
  });
});
