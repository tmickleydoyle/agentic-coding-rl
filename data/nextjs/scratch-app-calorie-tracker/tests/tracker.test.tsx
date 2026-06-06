import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Tracker", () => {
  it("shows correct consumed calories (1050)", () => {
    render(<App />);
    expect(screen.getByTestId("calories-consumed").textContent).toContain("1050");
  });

  it("shows goal calories (2000)", () => {
    render(<App />);
    expect(screen.getByTestId("calories-goal").textContent).toContain("2000");
  });

  it("shows remaining calories (950)", () => {
    render(<App />);
    expect(screen.getByTestId("calories-remaining").textContent).toContain("950");
  });

  it("shows 3 food log items", () => {
    render(<App />);
    expect(screen.getAllByTestId("food-log-item").length).toBe(3);
  });

  it("delete removes food log", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-log-c1"));
    expect(screen.getAllByTestId("food-log-item").length).toBe(2);
  });
});

describe("Goals", () => {
  it("displays current goal values", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goal-calories").textContent).toContain("2000");
  });

  it("updates goals on save", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    fireEvent.change(screen.getByTestId("input-goal-calories"), { target: { value: "2500" } });
    fireEvent.click(screen.getByTestId("save-goals-btn"));
    expect(screen.getByTestId("goal-calories").textContent).toContain("2500");
  });
});

describe("Add Food", () => {
  it("shows error on empty name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-food"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("adds food and updates tracker", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-food"));
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Apple" } });
    fireEvent.change(screen.getByTestId("input-calories"), { target: { value: "95" } });
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("calories-consumed").textContent).toContain("1145");
  });
});
