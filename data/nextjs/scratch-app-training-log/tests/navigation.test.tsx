import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); cleanup(); });

describe("navigation", () => {
  it("renders calendar by default", () => {
    render(<App />);
    expect(screen.getByTestId("calendar-page")).toBeTruthy();
  });

  it("navbar has all links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-calendar")).toBeTruthy();
    expect(screen.getByTestId("nav-exercises")).toBeTruthy();
    expect(screen.getByTestId("nav-goals")).toBeTruthy();
  });

  it("navigates to exercises", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-exercises"));
    expect(screen.getByTestId("exercises-page")).toBeTruthy();
  });

  it("navigates to goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goals-page")).toBeTruthy();
  });
});
