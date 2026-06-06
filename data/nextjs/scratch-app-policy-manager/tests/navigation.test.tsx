import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const seedPolicies = [
  { id: "1", title: "Acceptable Use Policy", department: "IT", version: "2.1", status: "Active", owner: "IT Director", reviewDate: "2024-12-01", summary: "" },
  { id: "2", title: "Remote Work Policy", department: "HR", version: "1.0", status: "Draft", owner: "HR Manager", reviewDate: "2024-06-15", summary: "" },
  { id: "3", title: "Data Retention Policy", department: "Legal", version: "3.0", status: "Active", owner: "General Counsel", reviewDate: "2024-09-30", summary: "" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", async () => ({ json: async () => seedPolicies }));
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

  it("navigates to policies list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    await waitFor(() => expect(screen.getByTestId("list-page")).toBeTruthy());
  });

  it("navigates back to dashboard", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    await waitFor(() => expect(screen.getByTestId("dashboard-page")).toBeTruthy());
  });

  it("navigates to add page", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-policy-btn"));
    expect(screen.getByTestId("add-page")).toBeTruthy();
  });
});
