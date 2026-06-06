import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Invoice Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByTestId("page-heading")).toHaveTextContent("Invoice Log");
  });

  it("shows correct outstanding total for seed data", () => {
    // pending: 950 + 1600 = 2550, overdue: 3300 => total 5850
    expect(screen.getByTestId("outstanding-total")).toHaveTextContent("Outstanding: $5850.00");
  });

  it("renders all 4 seed invoices", () => {
    expect(screen.getByTestId("invoice-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("invoice-row-4")).toBeInTheDocument();
  });

  it("shows invoice number and client", () => {
    expect(screen.getByTestId("invoice-number-1")).toHaveTextContent("INV-001");
    expect(screen.getByTestId("invoice-client-1")).toHaveTextContent("Acme Corp");
  });

  it("shows formatted amount", () => {
    expect(screen.getByTestId("invoice-amount-1")).toHaveTextContent("$2400.00");
  });

  it("paid invoice has no Mark Paid button", () => {
    expect(screen.queryByTestId("mark-paid-1")).not.toBeInTheDocument();
  });

  it("pending invoice has Mark Paid button", () => {
    expect(screen.getByTestId("mark-paid-2")).toBeInTheDocument();
  });

  it("Mark Paid changes status and removes button", async () => {
    await userEvent.click(screen.getByTestId("mark-paid-2"));
    expect(screen.getByTestId("invoice-status-2")).toHaveTextContent("[paid]");
    expect(screen.queryByTestId("mark-paid-2")).not.toBeInTheDocument();
  });

  it("marking pending invoice paid updates outstanding total", async () => {
    await userEvent.click(screen.getByTestId("mark-paid-2"));
    expect(screen.getByTestId("outstanding-total")).toHaveTextContent("Outstanding: $4900.00");
  });

  it("deleting an invoice removes it from the list", async () => {
    await userEvent.click(screen.getByTestId("delete-invoice-1"));
    expect(screen.queryByTestId("invoice-row-1")).not.toBeInTheDocument();
  });

  it("filter Pending shows only pending invoices", async () => {
    await userEvent.click(screen.getByTestId("filter-pending"));
    expect(screen.getByTestId("invoice-row-2")).toBeInTheDocument();
    expect(screen.getByTestId("invoice-row-3")).toBeInTheDocument();
    expect(screen.queryByTestId("invoice-row-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("invoice-row-4")).not.toBeInTheDocument();
  });

  it("filter Paid shows only paid invoices", async () => {
    await userEvent.click(screen.getByTestId("filter-paid"));
    expect(screen.getByTestId("invoice-row-1")).toBeInTheDocument();
    expect(screen.queryByTestId("invoice-row-2")).not.toBeInTheDocument();
  });

  it("adding an invoice increases the list", async () => {
    await userEvent.type(screen.getByTestId("form-number"), "INV-005");
    await userEvent.type(screen.getByTestId("form-client"), "New Co");
    await userEvent.type(screen.getByTestId("form-amount"), "500");
    await userEvent.click(screen.getByTestId("add-btn"));
    expect(screen.getByText("INV-005")).toBeInTheDocument();
    expect(screen.getByText("New Co")).toBeInTheDocument();
  });

  it("adding a pending invoice updates outstanding total", async () => {
    await userEvent.type(screen.getByTestId("form-number"), "INV-006");
    await userEvent.type(screen.getByTestId("form-client"), "Extra Co");
    await userEvent.type(screen.getByTestId("form-amount"), "1000");
    await userEvent.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("outstanding-total")).toHaveTextContent("Outstanding: $6850.00");
  });

  it("form resets after adding", async () => {
    await userEvent.type(screen.getByTestId("form-number"), "INV-007");
    await userEvent.type(screen.getByTestId("form-client"), "Temp");
    await userEvent.type(screen.getByTestId("form-amount"), "200");
    await userEvent.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("form-number")).toHaveValue("");
    expect(screen.getByTestId("form-client")).toHaveValue("");
  });

  it("shows empty state when all filtered invoices deleted", async () => {
    await userEvent.click(screen.getByTestId("filter-overdue"));
    await userEvent.click(screen.getByTestId("delete-invoice-4"));
    expect(screen.getByTestId("empty-state")).toHaveTextContent("No invoices found.");
  });
});
