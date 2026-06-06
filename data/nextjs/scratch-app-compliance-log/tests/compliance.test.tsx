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
  vi.stubGlobal("fetch", async (_url: string, opts?: RequestInit) => {
    if (opts?.method === "POST") return { json: async () => ({ id: "4" }) };
    return { json: async () => seedLogs };
  });
});

describe("dashboard stats", () => {
  it("shows total", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-total").textContent).toContain("3"));
  });
  it("shows open count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-open").textContent).toContain("2"));
  });
  it("shows resolved count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-resolved").textContent).toContain("1"));
  });
  it("shows critical count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-critical").textContent).toContain("1"));
  });
});

describe("log list and filters", () => {
  it("lists all log entries", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-logs"));
    await waitFor(() => screen.getByTestId("log-list"));
    expect(screen.getByTestId("log-item-1")).toBeTruthy();
    expect(screen.getByTestId("log-item-2")).toBeTruthy();
    expect(screen.getByTestId("log-item-3")).toBeTruthy();
  });

  it("filters by regulation", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-logs"));
    await waitFor(() => screen.getByTestId("log-list"));
    fireEvent.change(screen.getByTestId("filter-regulation"), { target: { value: "GDPR" } });
    expect(screen.getByTestId("log-item-1")).toBeTruthy();
    expect(screen.queryByTestId("log-item-2")).toBeNull();
  });

  it("combined filter shows no entries message", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-logs"));
    await waitFor(() => screen.getByTestId("log-list"));
    fireEvent.change(screen.getByTestId("filter-regulation"), { target: { value: "PCI" } });
    expect(screen.getByTestId("no-logs")).toBeTruthy();
  });
});

describe("add form validation", () => {
  it("shows error for empty title", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-logs"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-log-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-error").textContent).toContain("Title is required");
  });
});
