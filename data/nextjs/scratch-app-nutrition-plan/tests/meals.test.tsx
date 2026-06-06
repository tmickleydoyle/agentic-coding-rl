import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Meals", () => {
  it("shows seed meals", () => {
    render(<App />);
    expect(screen.getByTestId("meal-item-m1")).toBeTruthy();
    expect(screen.getByTestId("meal-item-m2")).toBeTruthy();
  });

  it("adds a meal", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("input-meal-name"), { target: { value: "Dinner Salad" } });
    fireEvent.click(screen.getByTestId("btn-add-meal"));
    expect(screen.getByText("Dinner Salad")).toBeTruthy();
  });

  it("deletes a meal", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-delete-meal-m1"));
    expect(screen.queryByTestId("meal-item-m1")).toBeNull();
  });

  it("foods page shows no-active-meal initially", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-foods"));
    expect(screen.getByTestId("no-active-meal")).toBeTruthy();
  });

  it("foods page shows form after selecting meal", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-select-meal-m1"));
    fireEvent.click(screen.getByTestId("nav-foods"));
    expect(screen.getByTestId("add-food-form")).toBeTruthy();
  });

  it("summary shows correct calorie total", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("summary-calories").textContent).toContain("700");
  });
});
