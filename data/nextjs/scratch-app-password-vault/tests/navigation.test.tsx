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

  it("shows vault by default", () => {
    render(<App />);
    expect(screen.getByTestId("vault-page")).toBeTruthy();
  });

  it("navigates to generate", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-generate"));
    expect(screen.getByTestId("generate-page")).toBeTruthy();
  });

  it("navigates to audit", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-audit"));
    expect(screen.getByTestId("audit-page")).toBeTruthy();
  });

  it("navigates to settings", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-settings"));
    expect(screen.getByTestId("settings-page")).toBeTruthy();
  });

  it("navigates back to vault", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-audit"));
    fireEvent.click(screen.getByTestId("nav-vault"));
    expect(screen.getByTestId("vault-page")).toBeTruthy();
  });
});
