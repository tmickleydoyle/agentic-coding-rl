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
  vi.stubGlobal("fetch", async (_url: string, opts?: RequestInit) => {
    if (opts?.method === "POST") return { json: async () => ({ id: "4" }) };
    return { json: async () => seedRisks };
  });
});

describe("dashboard stats", () => {
  it("shows total risks", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-total").textContent).toContain("3"));
  });

  it("shows open count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-open").textContent).toContain("2"));
  });

  it("shows highest risk title", async () => {
    render(<App />);
    await waitFor(() => {
      const highest = screen.getByTestId("stat-highest").textContent ?? "";
      expect(["Data Breach", "Regulatory Non-Compliance"].some((t) => highest.includes(t))).toBe(true);
    });
  });
});

describe("risk list", () => {
  it("lists all risks", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-risks"));
    await waitFor(() => screen.getByTestId("risk-list"));
    expect(screen.getByTestId("risk-item-1")).toBeTruthy();
    expect(screen.getByTestId("risk-item-2")).toBeTruthy();
    expect(screen.getByTestId("risk-item-3")).toBeTruthy();
  });

  it("shows risk score", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-risks"));
    await waitFor(() => screen.getByTestId("risk-list"));
    expect(screen.getByTestId("risk-score-1").textContent).toBe("15");
  });

  it("filters by category", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-risks"));
    await waitFor(() => screen.getByTestId("risk-list"));
    fireEvent.change(screen.getByTestId("filter-category"), { target: { value: "Security" } });
    expect(screen.getByTestId("risk-item-1")).toBeTruthy();
    expect(screen.queryByTestId("risk-item-2")).toBeNull();
  });

  it("shows no risks message when filter has no match", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-risks"));
    await waitFor(() => screen.getByTestId("risk-list"));
    fireEvent.change(screen.getByTestId("filter-category"), { target: { value: "Financial" } });
    expect(screen.getByTestId("no-risks")).toBeTruthy();
  });
});

describe("add risk form", () => {
  it("shows error for empty title", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-risks"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-risk-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-error").textContent).toContain("Title is required");
  });
});
