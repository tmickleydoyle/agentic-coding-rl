import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const seedRisks = [
  { id: "1", title: "Data Breach", category: "Security", likelihood: 3, impact: 5, status: "Open", owner: "Security Team", description: "" },
  { id: "2", title: "Vendor Failure", category: "Operational", likelihood: 2, impact: 4, status: "Mitigated", owner: "Procurement", description: "" },
  { id: "3", title: "Regulatory Non-Compliance", category: "Legal", likelihood: 2, impact: 5, status: "Open", owner: "Legal Team", description: "" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", async () => ({ json: async () => seedRisks }));
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

  it("navigates to risk list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-risks"));
    await waitFor(() => expect(screen.getByTestId("list-page")).toBeTruthy());
  });

  it("navigates back to dashboard", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-risks"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    await waitFor(() => expect(screen.getByTestId("dashboard-page")).toBeTruthy());
  });

  it("navigates to add page", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-risks"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-risk-btn"));
    expect(screen.getByTestId("add-page")).toBeTruthy();
  });
});
