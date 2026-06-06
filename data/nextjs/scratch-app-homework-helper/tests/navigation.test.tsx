import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("shows navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows home by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to assignments", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assignments"));
    expect(screen.getByTestId("assignments-page")).toBeTruthy();
  });

  it("navigates to subjects", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-subjects"));
    expect(screen.getByTestId("subjects-page")).toBeTruthy();
  });

  it("navigates to progress", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    expect(screen.getByTestId("progress-page")).toBeTruthy();
  });

  it("home stats are correct", () => {
    render(<App />);
    expect(screen.getByTestId("stat-todo").textContent).toContain("2");
  });
});
