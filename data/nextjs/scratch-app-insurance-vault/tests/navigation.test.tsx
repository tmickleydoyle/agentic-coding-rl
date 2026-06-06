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

  it("navigates to policies", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    expect(screen.getByTestId("policies-page")).toBeTruthy();
  });

  it("navigates to claims", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-claims"));
    expect(screen.getByTestId("claims-page")).toBeTruthy();
  });

  it("navigates to documents", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-documents"));
    expect(screen.getByTestId("documents-page")).toBeTruthy();
  });

  it("navigates to contacts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contacts"));
    expect(screen.getByTestId("contacts-page")).toBeTruthy();
  });
});
