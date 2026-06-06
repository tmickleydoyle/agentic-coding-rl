import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Burn Rate", () => {
  it("shows gross burn on dashboard", () => {
    render(<App />);
    // 55000 + 4000 + 8000 + 3000 = 70000
    expect(screen.getByTestId("gross-burn").textContent).toContain("70,000");
  });

  it("shows net burn on dashboard", () => {
    render(<App />);
    // 70000 - 30000 = 40000
    expect(screen.getByTestId("net-burn").textContent).toContain("40,000");
  });

  it("shows MRR on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("mrr").textContent).toContain("30,000");
  });

  it("shows N/A for MoM when only one month of data", () => {
    render(<App />);
    expect(screen.getByTestId("mom-change").textContent).toContain("N/A");
  });

  it("deletes a transaction", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-transactions"));
    fireEvent.click(screen.getByTestId("delete-tx-1"));
    expect(screen.queryByTestId("tx-item-1")).toBeNull();
  });

  it("prevents deleting a category in use", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-categories"));
    fireEvent.click(screen.getByTestId("delete-category-1")); // Payroll is in use
    expect(screen.getByTestId("category-error")).toBeTruthy();
  });

  it("forecast shows 6 rows", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-forecast"));
    expect(screen.getByTestId("forecast-row-1")).toBeTruthy();
    expect(screen.getByTestId("forecast-row-6")).toBeTruthy();
  });
});
