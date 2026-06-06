import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Inventory", () => {
  it("shows 5 seed items", () => {
    render(<App />);
    expect(screen.getByTestId("total-items").textContent).toContain("5");
  });

  it("increment increases quantity display", () => {
    render(<App />);
    const before = screen.getAllByTestId("pantry-item")[0].textContent;
    fireEvent.click(screen.getByTestId("increment-p1"));
    const after = screen.getAllByTestId("pantry-item")[0].textContent;
    expect(before).not.toBe(after);
  });

  it("delete removes item", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-btn-p1"));
    expect(screen.getByTestId("total-items").textContent).toContain("4");
  });
});

describe("Low Stock", () => {
  it("shows low-stock-count badge", () => {
    render(<App />);
    const badge = screen.getByTestId("low-stock-count");
    expect(Number(badge.textContent)).toBeGreaterThan(0);
  });

  it("shows low-stock-items on low stock page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-low-stock"));
    const items = screen.getAllByTestId("low-stock-item");
    expect(items.length).toBeGreaterThan(0);
  });
});

describe("Add Item", () => {
  it("shows error on empty name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-item"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("adds item and returns to inventory", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-item"));
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Pasta" } });
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("total-items").textContent).toContain("6");
  });
});
