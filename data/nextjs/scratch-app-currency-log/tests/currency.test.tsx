import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Home", () => {
  it("shows exchange count", () => {
    render(<App />);
    expect(screen.getByTestId("home-exchange-count").textContent).toBe("3");
  });

  it("shows total fees", () => {
    render(<App />);
    expect(screen.getByTestId("home-total-fees").textContent).toBe("10.00");
  });
});

describe("Log", () => {
  it("shows 3 exchange cards", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    expect(screen.getAllByTestId("exchange-card").length).toBe(3);
  });

  it("shows exchange from amount", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    const froms = screen.getAllByTestId("exchange-from").map((el) => el.textContent);
    expect(froms[0]).toContain("500");
  });

  it("shows exchange location", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    const locs = screen.getAllByTestId("exchange-location").map((el) => el.textContent);
    expect(locs).toContain("Tokyo Airport");
  });
});

describe("Add Exchange", () => {
  it("adds exchange and navigates to log", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add"));
    fireEvent.change(screen.getByTestId("input-date"), { target: { value: "2024-06-01" } });
    fireEvent.change(screen.getByTestId("input-from-currency"), { target: { value: "GBP" } });
    fireEvent.change(screen.getByTestId("input-to-currency"), { target: { value: "THB" } });
    fireEvent.change(screen.getByTestId("input-amount-from"), { target: { value: "100" } });
    fireEvent.change(screen.getByTestId("input-amount-to"), { target: { value: "4500" } });
    fireEvent.change(screen.getByTestId("input-location"), { target: { value: "Bangkok" } });
    fireEvent.click(screen.getByTestId("submit-exchange"));
    expect(screen.getByTestId("log-page")).toBeTruthy();
    expect(screen.getAllByTestId("exchange-card").length).toBe(4);
  });

  it("shows error for zero amount", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add"));
    fireEvent.change(screen.getByTestId("input-amount-from"), { target: { value: "0" } });
    fireEvent.change(screen.getByTestId("input-amount-to"), { target: { value: "0" } });
    fireEvent.click(screen.getByTestId("submit-exchange"));
    expect(screen.getByTestId("form-error")).toBeTruthy();
  });
});

describe("Summary", () => {
  it("shows summary rows", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getAllByTestId("summary-row").length).toBe(2);
  });

  it("shows correct JPY total", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    const currencies = screen.getAllByTestId("summary-currency").map((el) => el.textContent);
    const totals = screen.getAllByTestId("summary-total").map((el) => el.textContent);
    const jpyIdx = currencies.indexOf("JPY");
    expect(totals[jpyIdx]).toBe("102500");
  });
});
