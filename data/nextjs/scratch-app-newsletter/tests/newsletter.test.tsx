import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ campaigns: [], subscribers: [], templates: [] }) }));
});

describe("Newsletter UI", () => {
  it("shows no-campaigns when empty", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("no-campaigns")).toBeTruthy());
  });
  it("shows no-subscribers when empty", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-subscribers"));
    await waitFor(() => expect(screen.getByTestId("no-subscribers")).toBeTruthy());
  });
  it("add-campaign-form exists", () => {
    render(<App />);
    expect(screen.getByTestId("add-campaign-form")).toBeTruthy();
  });
  it("add-subscriber-form exists", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-subscribers"));
    expect(screen.getByTestId("add-subscriber-form")).toBeTruthy();
  });
  it("stats page shows total-subscribers", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    await waitFor(() => expect(screen.getByTestId("total-subscribers")).toBeTruthy());
  });
});
