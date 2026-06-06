import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const seedRequests = [
  { id: "1", title: "Budget Increase Q2", submitter: "alice@example.com", type: "Budget", amount: 15000, status: "Pending", comment: "", submittedAt: "2024-01-10" },
  { id: "2", title: "New Software License", submitter: "bob@example.com", type: "Software", amount: 2500, status: "Approved", comment: "Approved for team use", submittedAt: "2024-01-12" },
  { id: "3", title: "Conference Travel", submitter: "carol@example.com", type: "Travel", amount: 3000, status: "Rejected", comment: "Over budget", submittedAt: "2024-01-14" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", async (_url: string, opts?: RequestInit) => {
    if (opts?.method === "POST" || opts?.method === "PATCH") {
      return { json: async () => ({ id: "1" }) };
    }
    return { json: async () => seedRequests };
  });
});

describe("dashboard stats", () => {
  it("shows total", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-total").textContent).toContain("3"));
  });

  it("shows pending count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-pending").textContent).toContain("1"));
  });

  it("shows approved amount", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-approved-amount").textContent).toContain("2500"));
  });
});

describe("request list", () => {
  it("lists all requests", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-requests"));
    await waitFor(() => screen.getByTestId("request-list"));
    expect(screen.getByTestId("request-item-1")).toBeTruthy();
    expect(screen.getByTestId("request-item-2")).toBeTruthy();
    expect(screen.getByTestId("request-item-3")).toBeTruthy();
  });

  it("filters by status", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-requests"));
    await waitFor(() => screen.getByTestId("request-list"));
    fireEvent.change(screen.getByTestId("filter-status"), { target: { value: "Pending" } });
    expect(screen.getByTestId("request-item-1")).toBeTruthy();
    expect(screen.queryByTestId("request-item-2")).toBeNull();
  });

  it("shows no requests message", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-requests"));
    await waitFor(() => screen.getByTestId("request-list"));
    fireEvent.change(screen.getByTestId("filter-type"), { target: { value: "Equipment" } });
    expect(screen.getByTestId("no-requests")).toBeTruthy();
  });
});

describe("detail page", () => {
  it("shows approval actions for pending request", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-requests"));
    await waitFor(() => screen.getByTestId("request-list"));
    fireEvent.click(screen.getByTestId("request-link-1"));
    await waitFor(() => screen.getByTestId("detail-page"));
    expect(screen.getByTestId("approval-actions")).toBeTruthy();
  });
});

describe("add form validation", () => {
  it("shows errors for empty fields", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-requests"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-request-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-errors")).toBeTruthy();
  });
});
