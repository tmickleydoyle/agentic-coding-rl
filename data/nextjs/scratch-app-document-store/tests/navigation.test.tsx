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

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to documents", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-documents"));
    expect(screen.getByTestId("documents-page")).toBeTruthy();
  });

  it("navigates to folders", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-folders"));
    expect(screen.getByTestId("folders-page")).toBeTruthy();
  });

  it("navigates to shared", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-shared"));
    expect(screen.getByTestId("shared-page")).toBeTruthy();
  });

  it("navigates to search", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-search"));
    expect(screen.getByTestId("search-page")).toBeTruthy();
  });
});
