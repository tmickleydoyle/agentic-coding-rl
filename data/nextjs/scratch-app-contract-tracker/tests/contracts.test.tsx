import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const seedContracts = [
  { id: "1", title: "Software License Agreement", party: "Acme Corp", value: 50000, startDate: "2024-01-01", endDate: "2024-12-31", status: "Active" },
  { id: "2", title: "Consulting Services Contract", party: "Globex Inc", value: 25000, startDate: "2024-03-01", endDate: "2024-09-30", status: "Active" },
  { id: "3", title: "Maintenance Agreement", party: "Initech LLC", value: 12000, startDate: "2023-01-01", endDate: "2023-12-31", status: "Expired" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", async (_url: string, opts?: RequestInit) => {
    if (opts?.method === "POST") {
      return { json: async () => ({ id: "4", title: "New", party: "X", value: 1000, startDate: "", endDate: "", status: "Active" }) };
    }
    return { json: async () => seedContracts };
  });
});

describe("dashboard stats", () => {
  it("shows total contracts", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-total").textContent).toContain("3"));
  });

  it("shows active value sum", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-active-value").textContent).toContain("75000"));
  });

  it("shows active count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-active-count").textContent).toContain("2"));
  });
});

describe("contract list", () => {
  it("shows all contracts", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contracts"));
    await waitFor(() => screen.getByTestId("contract-list"));
    expect(screen.getByTestId("contract-item-1")).toBeTruthy();
    expect(screen.getByTestId("contract-item-2")).toBeTruthy();
    expect(screen.getByTestId("contract-item-3")).toBeTruthy();
  });

  it("filters by status", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contracts"));
    await waitFor(() => screen.getByTestId("contract-list"));
    fireEvent.change(screen.getByTestId("filter-status"), { target: { value: "Expired" } });
    expect(screen.queryByTestId("contract-item-1")).toBeNull();
    expect(screen.getByTestId("contract-item-3")).toBeTruthy();
  });

  it("shows no contracts message", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contracts"));
    await waitFor(() => screen.getByTestId("contract-list"));
    fireEvent.change(screen.getByTestId("filter-status"), { target: { value: "Terminated" } });
    expect(screen.getByTestId("no-contracts")).toBeTruthy();
  });
});

describe("add contract form validation", () => {
  it("shows error for empty title", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contracts"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-contract-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-errors")).toBeTruthy();
  });

  it("shows error for invalid value", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contracts"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-contract-btn"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "Title" } });
    fireEvent.change(screen.getByTestId("input-party"), { target: { value: "Party" } });
    fireEvent.change(screen.getByTestId("input-value"), { target: { value: "-5" } });
    fireEvent.click(screen.getByTestId("submit-btn"));
    const errorText = screen.getByTestId("form-errors").textContent;
    expect(errorText).toContain("Value must be greater than 0");
  });
});
