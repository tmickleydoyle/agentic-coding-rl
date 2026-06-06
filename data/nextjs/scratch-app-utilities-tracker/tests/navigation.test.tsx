import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to utilities", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-utilities"));
    expect(screen.getByTestId("utilities-page")).toBeTruthy();
  });

  it("navigates to bills", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bills"));
    expect(screen.getByTestId("bills-page")).toBeTruthy();
  });

  it("navigates to usage", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-usage"));
    expect(screen.getByTestId("usage-page")).toBeTruthy();
  });

  it("navigates to reports", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("reports-page")).toBeTruthy();
  });
});
