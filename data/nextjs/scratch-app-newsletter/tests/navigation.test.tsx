import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ campaigns: [], subscribers: [], templates: [] }) }));
});

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows campaigns by default", () => { render(<App />); expect(screen.getByTestId("campaigns-page")).toBeTruthy(); });
  it("navigates to subscribers", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-subscribers"));
    expect(screen.getByTestId("subscribers-page")).toBeTruthy();
  });
  it("navigates to templates", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-templates"));
    expect(screen.getByTestId("templates-page")).toBeTruthy();
  });
  it("navigates to stats", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stats-page")).toBeTruthy();
  });
});
