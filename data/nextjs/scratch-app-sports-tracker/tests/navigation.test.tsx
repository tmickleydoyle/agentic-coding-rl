import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
  cleanup();
});

describe("navigation", () => {
  it("renders dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navbar has all links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-dashboard")).toBeTruthy();
    expect(screen.getByTestId("nav-athletes")).toBeTruthy();
    expect(screen.getByTestId("nav-sessions")).toBeTruthy();
  });

  it("navigates to athletes page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-athletes"));
    expect(screen.getByTestId("athletes-page")).toBeTruthy();
  });

  it("navigates to sessions page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-sessions"));
    expect(screen.getByTestId("sessions-page")).toBeTruthy();
  });

  it("navigates back to dashboard", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-athletes"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });
});
