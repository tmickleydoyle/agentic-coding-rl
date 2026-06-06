import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const seedDocs = [
  { id: "1", title: "Employment Agreement", category: "Contract", status: "Active", createdAt: "2024-01-15" },
  { id: "2", title: "Privacy Policy", category: "Policy", status: "Active", createdAt: "2024-02-01" },
  { id: "3", title: "NDA Template", category: "NDA", status: "Draft", createdAt: "2024-03-10" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", async (url: string, opts?: RequestInit) => {
    if (opts?.method === "POST") {
      return { json: async () => ({ id: "4", title: "New Doc", category: "Contract", status: "Draft", createdAt: "2024-04-01" }) };
    }
    return { json: async () => seedDocs };
  });
});

describe("home stats", () => {
  it("shows total document count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-total").textContent).toContain("3"));
  });

  it("shows active count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-active").textContent).toContain("2"));
  });

  it("shows draft count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-draft").textContent).toContain("1"));
  });
});

describe("document list", () => {
  it("lists all documents", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-docs"));
    await waitFor(() => expect(screen.getByTestId("doc-list")).toBeTruthy());
    expect(screen.getByTestId("doc-item-1")).toBeTruthy();
    expect(screen.getByTestId("doc-item-2")).toBeTruthy();
    expect(screen.getByTestId("doc-item-3")).toBeTruthy();
  });

  it("filters by category", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-docs"));
    await waitFor(() => screen.getByTestId("doc-list"));
    fireEvent.change(screen.getByTestId("filter-category"), { target: { value: "NDA" } });
    expect(screen.queryByTestId("doc-item-1")).toBeNull();
    expect(screen.getByTestId("doc-item-3")).toBeTruthy();
  });

  it("shows no documents message when filter matches nothing", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-docs"));
    await waitFor(() => screen.getByTestId("doc-list"));
    fireEvent.change(screen.getByTestId("filter-status"), { target: { value: "Archived" } });
    expect(screen.getByTestId("no-docs")).toBeTruthy();
  });

  it("navigates to detail page on doc click", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-docs"));
    await waitFor(() => screen.getByTestId("doc-list"));
    fireEvent.click(screen.getByTestId("doc-link-1"));
    await waitFor(() => expect(screen.getByTestId("detail-page")).toBeTruthy());
  });
});

describe("add document form", () => {
  it("shows validation error for empty title", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-docs"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-doc-btn"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("form-error").textContent).toContain("Title is required");
  });

  it("cancel returns to list page", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-docs"));
    await waitFor(() => screen.getByTestId("list-page"));
    fireEvent.click(screen.getByTestId("add-doc-btn"));
    fireEvent.click(screen.getByTestId("cancel-btn"));
    expect(screen.getByTestId("list-page")).toBeTruthy();
  });
});
