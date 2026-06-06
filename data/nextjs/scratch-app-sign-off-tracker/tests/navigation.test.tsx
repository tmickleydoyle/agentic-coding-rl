import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const seedItems = [
  { id: "1", title: "Q1 Financial Report", signers: ["CFO", "CEO", "Auditor"], signed: ["CFO"], dueDate: "2024-03-31", status: "In Progress" },
  { id: "2", title: "Product Launch Plan", signers: ["VP Product", "VP Engineering", "CEO"], signed: ["VP Product", "VP Engineering", "CEO"], dueDate: "2024-04-15", status: "Complete" },
  { id: "3", title: "Security Audit Report", signers: ["CISO", "CTO"], signed: [], dueDate: "2024-05-01", status: "Pending" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", async () => ({ json: async () => seedItems }));
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

  it("navigates to sign-off list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-signoffs"));
    await waitFor(() => expect(screen.getByTestId("list-page")).toBeTruthy());
  });

  it("navigates back to dashboard", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-signoffs"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    await waitFor(() => expect(screen.getByTestId("dashboard-page")).toBeTruthy());
  });

  it("navigates to add page", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-signoffs"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-signoff-btn"));
    expect(screen.getByTestId("add-page")).toBeTruthy();
  });
});
