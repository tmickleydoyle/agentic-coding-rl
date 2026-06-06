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
  vi.stubGlobal("fetch", async () => ({ json: async () => seedContracts }));
});

describe("navigation", () => {
  it("renders dashboard by default", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("dashboard-page")).toBeTruthy());
  });

  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("navigates to list via navbar", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contracts"));
    await waitFor(() => expect(screen.getByTestId("list-page")).toBeTruthy());
  });

  it("navigates back to dashboard from list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contracts"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    await waitFor(() => expect(screen.getByTestId("dashboard-page")).toBeTruthy());
  });

  it("navigates to add page from list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contracts"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-contract-btn"));
    expect(screen.getByTestId("add-page")).toBeTruthy();
  });
});
