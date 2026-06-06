import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", async (url: string) => {
    if (url === "/api/documents") {
      return { json: async () => [
        { id: "1", title: "Employment Agreement", category: "Contract", status: "Active", createdAt: "2024-01-15" },
        { id: "2", title: "Privacy Policy", category: "Policy", status: "Active", createdAt: "2024-02-01" },
        { id: "3", title: "NDA Template", category: "NDA", status: "Draft", createdAt: "2024-03-10" },
      ]};
    }
    return { json: async () => ({}) };
  });
});

describe("navigation", () => {
  it("renders home page by default", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("home-page")).toBeTruthy());
  });

  it("renders navbar", async () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("navigates to list page via navbar", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-docs"));
    await waitFor(() => expect(screen.getByTestId("list-page")).toBeTruthy());
  });

  it("navigates to home via navbar from list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-docs"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("nav-home"));
    await waitFor(() => expect(screen.getByTestId("home-page")).toBeTruthy());
  });

  it("navigates to add page from list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-docs"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-doc-btn"));
    expect(screen.getByTestId("add-page")).toBeTruthy();
  });
});
