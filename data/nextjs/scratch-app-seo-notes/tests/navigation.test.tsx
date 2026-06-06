import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ keywords: [], pages: [], backlinks: [], reports: [] }) }));
});

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows keywords by default", () => { render(<App />); expect(screen.getByTestId("keywords-page")).toBeTruthy(); });
  it("navigates to pages", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-pages"));
    expect(screen.getByTestId("pages-page")).toBeTruthy();
  });
  it("navigates to backlinks", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-backlinks"));
    expect(screen.getByTestId("backlinks-page")).toBeTruthy();
  });
  it("navigates to reports", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("reports-page")).toBeTruthy();
  });
});
