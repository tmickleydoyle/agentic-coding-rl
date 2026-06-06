import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders navbar with all links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-home")).toBeTruthy();
    expect(screen.getByTestId("nav-exams")).toBeTruthy();
    expect(screen.getByTestId("nav-practice")).toBeTruthy();
    expect(screen.getByTestId("nav-results")).toBeTruthy();
  });

  it("shows home by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to exams", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-exams"));
    expect(screen.getByTestId("exams-page")).toBeTruthy();
  });

  it("navigates to practice", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-practice"));
    expect(screen.getByTestId("practice-page")).toBeTruthy();
  });

  it("navigates to results", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-results"));
    expect(screen.getByTestId("results-page")).toBeTruthy();
  });

  it("home shows upcoming count", () => {
    render(<App />);
    expect(screen.getByTestId("stat-upcoming").textContent).toContain("2");
  });
});
