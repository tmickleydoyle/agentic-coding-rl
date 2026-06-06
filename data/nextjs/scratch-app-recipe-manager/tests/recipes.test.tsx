import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Dashboard", () => {
  it("shows 3 seed recipes", () => {
    render(<App />);
    expect(screen.getByTestId("recipe-count").textContent).toContain("3");
  });

  it("lists all recipe names", () => {
    render(<App />);
    const items = screen.getAllByTestId("recipe-item");
    expect(items.length).toBe(3);
  });

  it("clicking a recipe navigates to view-recipe", () => {
    render(<App />);
    fireEvent.click(screen.getAllByTestId("recipe-item")[0]);
    expect(screen.getByTestId("recipe-name")).toBeTruthy();
  });
});

describe("View Recipe", () => {
  it("shows recipe name", () => {
    render(<App />);
    fireEvent.click(screen.getAllByTestId("recipe-item")[0]);
    expect(screen.getByTestId("recipe-name").textContent).toBe("Pancakes");
  });

  it("shows recipe category", () => {
    render(<App />);
    fireEvent.click(screen.getAllByTestId("recipe-item")[0]);
    expect(screen.getByTestId("recipe-category").textContent).toContain("breakfast");
  });

  it("delete button removes recipe and returns to dashboard", () => {
    render(<App />);
    fireEvent.click(screen.getAllByTestId("recipe-item")[0]);
    fireEvent.click(screen.getByTestId("delete-btn"));
    const items = screen.getAllByTestId("recipe-item");
    expect(items.length).toBe(2);
  });
});

describe("Add Recipe", () => {
  it("shows error when name is empty", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-recipe"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("adds a new recipe and navigates to dashboard", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-recipe"));
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Omelette" } });
    fireEvent.change(screen.getByTestId("input-ingredients"), { target: { value: "Eggs\nCheese" } });
    fireEvent.change(screen.getByTestId("input-instructions"), { target: { value: "Whisk and fry." } });
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("recipe-count").textContent).toContain("4");
  });
});
