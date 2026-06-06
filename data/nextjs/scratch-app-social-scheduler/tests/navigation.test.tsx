import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ posts: [], accounts: [] }) }));
});

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows feed by default", () => { render(<App />); expect(screen.getByTestId("feed-page")).toBeTruthy(); });
  it("navigates to compose", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-compose"));
    expect(screen.getByTestId("compose-page")).toBeTruthy();
  });
  it("navigates to queue", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-queue"));
    expect(screen.getByTestId("queue-page")).toBeTruthy();
  });
  it("navigates to accounts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-accounts"));
    expect(screen.getByTestId("accounts-page")).toBeTruthy();
  });
});
