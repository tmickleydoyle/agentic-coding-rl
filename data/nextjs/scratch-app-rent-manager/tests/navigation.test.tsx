import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("navigation", () => {
  it("renders the navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to tenants page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tenants"));
    expect(screen.getByTestId("tenants-page")).toBeTruthy();
  });

  it("navigates to payments page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-payments"));
    expect(screen.getByTestId("payments-page")).toBeTruthy();
  });

  it("navigates to settings page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-settings"));
    expect(screen.getByTestId("settings-page")).toBeTruthy();
  });

  it("navigates back to dashboard", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tenants"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });
});
