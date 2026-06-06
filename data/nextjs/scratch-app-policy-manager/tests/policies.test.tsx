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
  vi.stubGlobal("fetch", async (_url: string, opts?: RequestInit) => {
    if (opts?.method === "POST") return { json: async () => ({ id: "4" }) };
    return { json: async () => seedPolicies };
  });
});

describe("dashboard stats", () => {
  it("shows total policies", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-total").textContent).toContain("3"));
  });

  it("shows active count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-active").textContent).toContain("2"));
  });

  it("shows draft count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-draft").textContent).toContain("1"));
  });
});

describe("policy list", () => {
  it("shows all policies", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    await waitFor(() => screen.getByTestId("policy-list"));
    expect(screen.getByTestId("policy-item-1")).toBeTruthy();
    expect(screen.getByTestId("policy-item-2")).toBeTruthy();
    expect(screen.getByTestId("policy-item-3")).toBeTruthy();
  });

  it("filters by department", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    await waitFor(() => screen.getByTestId("policy-list"));
    fireEvent.change(screen.getByTestId("filter-department"), { target: { value: "IT" } });
    expect(screen.getByTestId("policy-item-1")).toBeTruthy();
    expect(screen.queryByTestId("policy-item-2")).toBeNull();
  });

  it("filters by status", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    await waitFor(() => screen.getByTestId("policy-list"));
    fireEvent.change(screen.getByTestId("filter-status"), { target: { value: "Draft" } });
    expect(screen.queryByTestId("policy-item-1")).toBeNull();
    expect(screen.getByTestId("policy-item-2")).toBeTruthy();
  });

  it("shows no policies message", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    await waitFor(() => screen.getByTestId("policy-list"));
    fireEvent.change(screen.getByTestId("filter-department"), { target: { value: "Finance" } });
    expect(screen.getByTestId("no-policies")).toBeTruthy();
  });
});

describe("add form validation", () => {
  it("shows error for empty title", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-policy-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-errors")).toBeTruthy();
  });

  it("shows error for empty version", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-policy-btn"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "Title" } });
    fireEvent.click(screen.getByTestId("submit-btn"));
    const errText = screen.getByTestId("form-errors").textContent;
    expect(errText).toContain("Version is required");
  });
});
