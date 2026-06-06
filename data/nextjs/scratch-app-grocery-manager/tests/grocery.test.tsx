import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Shopping List", () => {
  it("shows 5 seed items", () => {
    render(<App />);
    expect(screen.getByTestId("total-count").textContent).toContain("5");
  });

  it("shows 4 unchecked items initially", () => {
    render(<App />);
    expect(screen.getByTestId("unchecked-count").textContent).toContain("4");
  });

  it("toggles a checkbox updates unchecked count", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("item-checkbox-g1"));
    expect(screen.getByTestId("unchecked-count").textContent).toContain("3");
  });

  it("delete removes item", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-btn-g1"));
    expect(screen.getByTestId("total-count").textContent).toContain("4");
  });
});

describe("Add Item", () => {
  it("shows error on empty name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-item"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("adds item and navigates to list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-item"));
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Yogurt" } });
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("total-count").textContent).toContain("6");
  });
});

describe("Categories", () => {
  it("shows category rows for categories with items", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-categories"));
    const rows = screen.getAllByTestId("category-row");
    expect(rows.length).toBe(5);
  });
});
