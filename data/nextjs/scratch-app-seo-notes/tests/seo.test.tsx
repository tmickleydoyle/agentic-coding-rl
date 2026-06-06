import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ keywords: [], pages: [], backlinks: [], reports: [] }) }));
});

describe("SEO Notes UI", () => {
  it("keywords page has add-keyword-form", () => {
    render(<App />);
    expect(screen.getByTestId("add-keyword-form")).toBeTruthy();
  });
  it("backlinks page shows no-backlinks when empty", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-backlinks"));
    await waitFor(() => expect(screen.getByTestId("no-backlinks")).toBeTruthy());
  });
  it("reports page shows no-reports when empty", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    await waitFor(() => expect(screen.getByTestId("no-reports")).toBeTruthy());
  });
  it("reports page has generate button", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("generate-report-btn")).toBeTruthy();
  });
  it("pages page has add-page-form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-pages"));
    expect(screen.getByTestId("add-page-form")).toBeTruthy();
  });
});
