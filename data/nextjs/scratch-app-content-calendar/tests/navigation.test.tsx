import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ items: [] }) }));
});

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows calendar by default", () => { render(<App />); expect(screen.getByTestId("calendar-page")).toBeTruthy(); });
  it("navigates to drafts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-drafts"));
    expect(screen.getByTestId("drafts-page")).toBeTruthy();
  });
  it("navigates to publish", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-publish"));
    expect(screen.getByTestId("publish-page")).toBeTruthy();
  });
  it("navigates to analytics", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-analytics"));
    expect(screen.getByTestId("analytics-page")).toBeTruthy();
  });
});
