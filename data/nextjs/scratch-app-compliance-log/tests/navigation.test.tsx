import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const seedLogs = [
  { id: "1", title: "GDPR Data Audit", regulation: "GDPR", severity: "High", status: "Resolved", date: "2024-01-20", notes: "Annual audit completed" },
  { id: "2", title: "SOX Financial Control Review", regulation: "SOX", severity: "Critical", status: "Open", date: "2024-02-15", notes: "Under review" },
  { id: "3", title: "HIPAA Security Assessment", regulation: "HIPAA", severity: "Medium", status: "Open", date: "2024-03-05", notes: "Initial assessment" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", async () => ({ json: async () => seedLogs }));
});

describe("navigation", () => {
  it("renders dashboard by default", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("dashboard-page")).toBeTruthy());
  });

  it("shows navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("navigates to list page", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-logs"));
    await waitFor(() => expect(screen.getByTestId("list-page")).toBeTruthy());
  });

  it("navigates back to dashboard", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-logs"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    await waitFor(() => expect(screen.getByTestId("dashboard-page")).toBeTruthy());
  });

  it("navigates to add page from list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-logs"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-log-btn"));
    expect(screen.getByTestId("add-page")).toBeTruthy();
  });
});
