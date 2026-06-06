import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const mockTenants = [
  { id: "t1", name: "Alice Johnson", unit: "101", monthlyRent: 1200, leaseStart: "2024-01-01", leaseEnd: "2024-12-31", status: "active" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockImplementation((url: string) => {
    if (url.includes("tenants")) return Promise.resolve({ json: async () => mockTenants });
    return Promise.resolve({ json: async () => [] });
  }));
});

describe("tenants page", () => {
  it("shows tenant list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tenants"));
    await waitFor(() => expect(screen.getByTestId("tenant-list")).toBeTruthy());
  });

  it("has add tenant inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tenants"));
    expect(screen.getByTestId("tenant-name-input")).toBeTruthy();
    expect(screen.getByTestId("tenant-unit-input")).toBeTruthy();
    expect(screen.getByTestId("tenant-rent-input")).toBeTruthy();
  });

  it("has add tenant button", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tenants"));
    expect(screen.getByTestId("add-tenant-btn")).toBeTruthy();
  });

  it("calls fetch to add tenant", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tenants"));
    fireEvent.change(screen.getByTestId("tenant-name-input"), { target: { value: "Carol" } });
    fireEvent.change(screen.getByTestId("tenant-unit-input"), { target: { value: "103" } });
    fireEvent.change(screen.getByTestId("tenant-rent-input"), { target: { value: "1000" } });
    fireEvent.click(screen.getByTestId("add-tenant-btn"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("tenants"), expect.objectContaining({ method: "POST" })));
  });
});
