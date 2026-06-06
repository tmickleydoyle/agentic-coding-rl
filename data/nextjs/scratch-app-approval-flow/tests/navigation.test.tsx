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
  vi.stubGlobal("fetch", async () => ({ json: async () => seedRequests }));
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

  it("navigates to requests list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-requests"));
    await waitFor(() => expect(screen.getByTestId("list-page")).toBeTruthy());
  });

  it("navigates back to dashboard", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-requests"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    await waitFor(() => expect(screen.getByTestId("dashboard-page")).toBeTruthy());
  });

  it("navigates to add page", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-requests"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-request-btn"));
    expect(screen.getByTestId("add-page")).toBeTruthy();
  });
});
