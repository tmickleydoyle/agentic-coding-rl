import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ posts: [], accounts: [] }) }));
});

describe("Social Scheduler UI", () => {
  it("compose page has body textarea", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-compose"));
    expect(screen.getByTestId("compose-body")).toBeTruthy();
  });

  it("compose page has char count", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-compose"));
    expect(screen.getByTestId("char-count")).toBeTruthy();
  });

  it("compose page has schedule input", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-compose"));
    expect(screen.getByTestId("compose-schedule")).toBeTruthy();
  });

  it("queue shows empty-queue when no scheduled posts", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-queue"));
    await waitFor(() => expect(screen.getByTestId("empty-queue")).toBeTruthy());
  });

  it("accounts page has add-account-form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-accounts"));
    expect(screen.getByTestId("add-account-form")).toBeTruthy();
  });
});
