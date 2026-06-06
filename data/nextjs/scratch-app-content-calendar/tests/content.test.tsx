import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ items: [] }) }));
});

describe("Content Calendar UI", () => {
  it("shows add-content-form on calendar page", () => {
    render(<App />);
    expect(screen.getByTestId("add-content-form")).toBeTruthy();
  });
  it("shows no-drafts when empty", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-drafts"));
    await waitFor(() => expect(screen.getByTestId("no-drafts")).toBeTruthy());
  });
  it("shows no-publish when empty", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-publish"));
    await waitFor(() => expect(screen.getByTestId("no-publish")).toBeTruthy());
  });
  it("analytics page renders total-items", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-analytics"));
    await waitFor(() => expect(screen.getByTestId("total-items")).toBeTruthy());
  });
  it("calendar-grid exists", () => {
    render(<App />);
    expect(screen.getByTestId("calendar-grid")).toBeTruthy();
  });
});
