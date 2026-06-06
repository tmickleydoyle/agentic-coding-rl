import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Weekly Plan", () => {
  it("shows 4 seed meal entries", () => {
    render(<App />);
    expect(screen.getByTestId("total-meals").textContent).toContain("4");
  });

  it("renders day sections for all 7 days", () => {
    render(<App />);
    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    days.forEach((d) => expect(screen.getByTestId(`day-section-${d}`)).toBeTruthy());
  });

  it("Monday has 2 entries", () => {
    render(<App />);
    const monday = screen.getByTestId("day-section-Monday");
    expect(monday.querySelectorAll("[data-testid='meal-entry']").length).toBe(2);
  });

  it("clicking meal navigates to detail", () => {
    render(<App />);
    fireEvent.click(screen.getAllByTestId("meal-entry")[0]);
    expect(screen.getByTestId("detail-name")).toBeTruthy();
  });
});

describe("Meal Detail", () => {
  it("shows meal name", () => {
    render(<App />);
    fireEvent.click(screen.getAllByTestId("meal-entry")[0]);
    expect(screen.getByTestId("detail-name").textContent).toBe("Oatmeal");
  });

  it("delete removes meal", () => {
    render(<App />);
    fireEvent.click(screen.getAllByTestId("meal-entry")[0]);
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(screen.getByTestId("total-meals").textContent).toContain("3");
  });
});

describe("Add Meal", () => {
  it("shows error on empty name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-meal"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("adds meal and returns to weekly plan", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-meal"));
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Smoothie" } });
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("total-meals").textContent).toContain("5");
  });
});
