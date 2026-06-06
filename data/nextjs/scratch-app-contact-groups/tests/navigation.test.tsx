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

  it("shows contacts by default", () => {
    render(<App />);
    expect(screen.getByTestId("contacts-page")).toBeTruthy();
  });

  it("navigates to groups", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-groups"));
    expect(screen.getByTestId("groups-page")).toBeTruthy();
  });

  it("navigates to favorites", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-favorites"));
    expect(screen.getByTestId("favorites-page")).toBeTruthy();
  });

  it("navigates to import", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-import"));
    expect(screen.getByTestId("import-page")).toBeTruthy();
  });

  it("navigates back to contacts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-groups"));
    fireEvent.click(screen.getByTestId("nav-contacts"));
    expect(screen.getByTestId("contacts-page")).toBeTruthy();
  });
});
