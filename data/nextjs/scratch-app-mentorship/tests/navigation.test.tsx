import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders all nav links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-dashboard")).toBeTruthy();
    expect(screen.getByTestId("nav-mentors")).toBeTruthy();
    expect(screen.getByTestId("nav-sessions")).toBeTruthy();
    expect(screen.getByTestId("nav-goals")).toBeTruthy();
  });

  it("starts on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to mentors", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-mentors"));
    expect(screen.getByTestId("mentors-page")).toBeTruthy();
  });

  it("navigates to sessions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-sessions"));
    expect(screen.getByTestId("sessions-page")).toBeTruthy();
  });

  it("navigates to goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goals-page")).toBeTruthy();
  });
});
