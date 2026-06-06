import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Payment Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByTestId("page-heading")).toHaveTextContent("Payment Tracker");
  });

  it("shows correct total received for seed data", () => {
    // 2500 + 2400 + 1500 + 1000 = 7400
    expect(screen.getByTestId("total-received")).toHaveTextContent("Total Received: $7400.00");
  });

  it("renders all 4 seed payments", () => {
    expect(screen.getByTestId("payment-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("payment-row-4")).toBeInTheDocument();
  });

  it("shows payment client and amount", () => {
    expect(screen.getByTestId("payment-client-1")).toHaveTextContent("Acme Corp");
    expect(screen.getByTestId("payment-amount-1")).toHaveTextContent("$2500.00");
  });

  it("shows client balance rows", () => {
    expect(screen.getByTestId("balance-row-Acme-Corp")).toBeInTheDocument();
    expect(screen.getByTestId("balance-row-Beta-Studio")).toBeInTheDocument();
    expect(screen.getByTestId("balance-row-Gamma-LLC")).toBeInTheDocument();
  });

  it("calculates Acme Corp balance correctly", () => {
    // expected 5000, paid 2500+1500=4000, due=1000
    expect(screen.getByTestId("balance-expected-Acme-Corp")).toHaveTextContent("$5000.00");
    expect(screen.getByTestId("balance-paid-Acme-Corp")).toHaveTextContent("$4000.00");
    expect(screen.getByTestId("balance-due-Acme-Corp")).toHaveTextContent("$1000.00");
  });

  it("calculates Beta Studio balance as fully paid", () => {
    // expected 2400, paid 2400, due=0
    expect(screen.getByTestId("balance-due-Beta-Studio")).toHaveTextContent("$0.00");
  });

  it("calculates Gamma LLC balance correctly", () => {
    // expected 3200, paid 1000, due=2200
    expect(screen.getByTestId("balance-due-Gamma-LLC")).toHaveTextContent("$2200.00");
  });

  it("logging a payment increases total received", async () => {
    const select = screen.getByTestId("form-client");
    await userEvent.selectOptions(select, "Gamma LLC");
    await userEvent.type(screen.getByTestId("form-amount"), "500");
    await userEvent.click(screen.getByTestId("log-btn"));
    expect(screen.getByTestId("total-received")).toHaveTextContent("Total Received: $7900.00");
  });

  it("logging a payment updates client balance", async () => {
    const select = screen.getByTestId("form-client");
    await userEvent.selectOptions(select, "Gamma LLC");
    await userEvent.type(screen.getByTestId("form-amount"), "500");
    await userEvent.click(screen.getByTestId("log-btn"));
    expect(screen.getByTestId("balance-paid-Gamma-LLC")).toHaveTextContent("$1500.00");
    expect(screen.getByTestId("balance-due-Gamma-LLC")).toHaveTextContent("$1700.00");
  });

  it("does not log payment if amount is 0", async () => {
    await userEvent.type(screen.getByTestId("form-amount"), "0");
    await userEvent.click(screen.getByTestId("log-btn"));
    expect(screen.getByTestId("total-received")).toHaveTextContent("Total Received: $7400.00");
  });

  it("deleting a payment updates total and balance", async () => {
    await userEvent.click(screen.getByTestId("delete-payment-4"));
    expect(screen.getByTestId("total-received")).toHaveTextContent("Total Received: $6400.00");
    expect(screen.getByTestId("balance-paid-Gamma-LLC")).toHaveTextContent("$0.00");
  });

  it("shows payment reference", () => {
    expect(screen.getByTestId("payment-reference-1")).toHaveTextContent("ACH-20240110");
  });

  it("payments are sorted newest first", () => {
    const list = screen.getByTestId("payments-list");
    const items = list.querySelectorAll("[data-testid^='payment-row-']");
    // ACH-20240120 (2024-01-20) should come before ACH-20240110
    const firstDate = items[0].querySelector("[data-testid^='payment-date-']");
    const lastDate = items[items.length - 1].querySelector("[data-testid^='payment-date-']");
    expect(firstDate?.textContent).toBeGreaterThanOrEqual(lastDate?.textContent ?? "");
  });
});
