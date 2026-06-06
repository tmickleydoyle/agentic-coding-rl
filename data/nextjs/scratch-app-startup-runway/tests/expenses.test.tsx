import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

function goToExpenses() {
  render(<App />);
  fireEvent.click(screen.getByTestId("nav-expenses"));
}

describe("Expenses", () => {
  it("shows seed expenses", () => {
    goToExpenses();
    expect(screen.getByTestId("expense-item-1")).toBeTruthy();
    expect(screen.getByTestId("expense-item-2")).toBeTruthy();
    expect(screen.getByTestId("expense-item-3")).toBeTruthy();
    expect(screen.getByTestId("expense-item-4")).toBeTruthy();
  });

  it("adds a new expense", () => {
    goToExpenses();
    fireEvent.change(screen.getByTestId("expense-name-input"), { target: { value: "AWS" } });
    fireEvent.change(screen.getByTestId("expense-amount-input"), { target: { value: "3000" } });
    fireEvent.click(screen.getByTestId("add-expense-btn"));
    expect(screen.getByText("AWS")).toBeTruthy();
  });

  it("shows error when name is empty", () => {
    goToExpenses();
    fireEvent.change(screen.getByTestId("expense-amount-input"), { target: { value: "100" } });
    fireEvent.click(screen.getByTestId("add-expense-btn"));
    expect(screen.getByTestId("expense-error")).toBeTruthy();
  });

  it("shows error when amount is zero", () => {
    goToExpenses();
    fireEvent.change(screen.getByTestId("expense-name-input"), { target: { value: "Test" } });
    fireEvent.change(screen.getByTestId("expense-amount-input"), { target: { value: "0" } });
    fireEvent.click(screen.getByTestId("add-expense-btn"));
    expect(screen.getByTestId("expense-error")).toBeTruthy();
  });

  it("deletes an expense", () => {
    goToExpenses();
    fireEvent.click(screen.getByTestId("delete-btn-1"));
    expect(screen.queryByTestId("expense-item-1")).toBeNull();
  });
});
