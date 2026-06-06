import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to tutors", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tutors"));
    expect(screen.getByTestId("tutors-page")).toBeTruthy();
  });

  it("navigates to bookings", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bookings"));
    expect(screen.getByTestId("bookings-page")).toBeTruthy();
  });

  it("navigates to subjects", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-subjects"));
    expect(screen.getByTestId("subjects-page")).toBeTruthy();
  });

  it("home shows tutor count", () => {
    render(<App />);
    expect(screen.getByTestId("stat-tutors").textContent).toContain("3");
  });
});
