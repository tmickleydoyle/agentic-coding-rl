import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders shopping list by default", () => {
    render(<App />);
    expect(screen.getByTestId("total-count")).toBeTruthy();
  });

  it("has all nav buttons", () => {
    render(<App />);
    expect(screen.getByTestId("nav-shopping-list")).toBeTruthy();
    expect(screen.getByTestId("nav-add-item")).toBeTruthy();
    expect(screen.getByTestId("nav-categories")).toBeTruthy();
  });

  it("navigates to add-item", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-item"));
    expect(screen.getByTestId("add-item-form")).toBeTruthy();
  });

  it("navigates to categories", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-categories"));
    expect(screen.getAllByTestId("category-row").length).toBeGreaterThan(0);
  });
});
