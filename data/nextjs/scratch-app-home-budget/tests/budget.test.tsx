import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Home Summary", () => {
  it("shows total income", () => {
    render(<App />);
    expect(screen.getByTestId("total-income").textContent).toContain("4500.00");
  });

  it("shows total expenses", () => {
    render(<App />);
    expect(screen.getByTestId("total-expenses").textContent).toContain("1780.00");
  });

  it("shows correct balance", () => {
    render(<App />);
    expect(screen.getByTestId("balance").textContent).toContain("2720.00");
  });
});

describe("Expenses", () => {
  it("lists seed expenses", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    expect(screen.getByTestId("expense-e1")).toBeTruthy();
    expect(screen.getByTestId("expense-e2")).toBeTruthy();
    expect(screen.getByTestId("expense-e3")).toBeTruthy();
  });

  it("adds a new expense", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    fireEvent.change(screen.getByTestId("expense-description"), { target: { value: "Electric Bill" } });
    fireEvent.change(screen.getByTestId("expense-amount"), { target: { value: "120" } });
    fireEvent.change(screen.getByTestId("expense-date"), { target: { value: "2024-01-20" } });
    fireEvent.click(screen.getByTestId("add-expense-btn"));
    expect(screen.getByText("Electric Bill")).toBeTruthy();
  });

  it("deletes an expense", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    fireEvent.click(screen.getByTestId("delete-expense-e1"));
    expect(screen.queryByTestId("expense-e1")).toBeNull();
  });
});

describe("Income", () => {
  it("lists seed incomes", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-income"));
    expect(screen.getByTestId("income-i1")).toBeTruthy();
    expect(screen.getByTestId("income-i2")).toBeTruthy();
  });

  it("adds a new income", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-income"));
    fireEvent.change(screen.getByTestId("income-source"), { target: { value: "Bonus" } });
    fireEvent.change(screen.getByTestId("income-amount"), { target: { value: "1000" } });
    fireEvent.change(screen.getByTestId("income-date"), { target: { value: "2024-01-25" } });
    fireEvent.click(screen.getByTestId("add-income-btn"));
    expect(screen.getByText("Bonus")).toBeTruthy();
  });
});

describe("Reports", () => {
  it("shows category breakdown", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("category-housing")).toBeTruthy();
    expect(screen.getByTestId("category-total-housing").textContent).toContain("1500.00");
  });

  it("shows report balance", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("report-balance").textContent).toContain("2720.00");
  });
});
