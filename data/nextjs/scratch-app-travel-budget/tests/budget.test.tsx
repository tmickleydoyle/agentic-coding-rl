import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Home budget overview", () => {
  it("shows total budget", () => {
    render(<App />);
    expect(screen.getByTestId("home-total-budget").textContent).toBe("3000");
  });

  it("shows total spent", () => {
    render(<App />);
    // 120+12+80+5+60 = 277
    expect(screen.getByTestId("home-total-spent").textContent).toBe("277");
  });

  it("shows remaining", () => {
    render(<App />);
    // 3000 - 277 = 2723
    expect(screen.getByTestId("home-remaining").textContent).toBe("2723");
  });

  it("shows percent used", () => {
    render(<App />);
    // 277/3000 * 100 = 9.2333... -> 9.2%
    expect(screen.getByTestId("home-percent-used").textContent).toBe("9.2%");
  });
});

describe("Expenses list", () => {
  it("shows 5 expense cards", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    expect(screen.getAllByTestId("expense-card").length).toBe(5);
  });

  it("shows expense description", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    const descs = screen.getAllByTestId("expense-description").map((el) => el.textContent);
    expect(descs).toContain("Hotel check-in");
  });
});

describe("Add expense", () => {
  it("adds expense and navigates to expenses", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-expense"));
    fireEvent.change(screen.getByTestId("input-date"), { target: { value: "2024-03-18" } });
    fireEvent.change(screen.getByTestId("input-description"), { target: { value: "Gyoza dinner" } });
    fireEvent.change(screen.getByTestId("input-amount"), { target: { value: "15" } });
    fireEvent.change(screen.getByTestId("input-currency"), { target: { value: "JPY" } });
    fireEvent.change(screen.getByTestId("input-original-amount"), { target: { value: "2205" } });
    fireEvent.click(screen.getByTestId("submit-expense"));
    expect(screen.getByTestId("expenses-page")).toBeTruthy();
    expect(screen.getAllByTestId("expense-card").length).toBe(6);
  });
});

describe("Summary", () => {
  it("shows 5 summary rows (one per category)", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getAllByTestId("summary-row").length).toBe(5);
  });

  it("Accommodation is first (highest amount)", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    const cats = screen.getAllByTestId("summary-category").map((el) => el.textContent);
    expect(cats[0]).toBe("Accommodation");
  });

  it("shows percentage with % sign", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    const percents = screen.getAllByTestId("summary-percent").map((el) => el.textContent);
    percents.forEach((p) => expect(p).toMatch(/%$/));
  });
});
