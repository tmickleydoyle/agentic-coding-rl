import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ events: [], funnels: [], segments: [], total: 0, uniqueSessions: 0, top3: [] }) }));
});

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows overview by default", () => { render(<App />); expect(screen.getByTestId("overview-page")).toBeTruthy(); });
  it("navigates to events", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    expect(screen.getByTestId("events-page")).toBeTruthy();
  });
  it("navigates to funnels", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-funnels"));
    expect(screen.getByTestId("funnels-page")).toBeTruthy();
  });
  it("navigates to segments", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-segments"));
    expect(screen.getByTestId("segments-page")).toBeTruthy();
  });
});
