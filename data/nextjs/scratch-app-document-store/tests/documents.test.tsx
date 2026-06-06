import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("documents page", () => {
  it("has doc inputs and list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-documents"));
    expect(screen.getByTestId("doc-title-input")).toBeTruthy();
    expect(screen.getByTestId("doc-list")).toBeTruthy();
    expect(screen.getByTestId("add-doc-btn")).toBeTruthy();
  });

  it("calls POST on add doc", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-documents"));
    fireEvent.change(screen.getByTestId("doc-title-input"), { target: { value: "My Doc" } });
    fireEvent.click(screen.getByTestId("add-doc-btn"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "POST" })));
  });
});

describe("folders page", () => {
  it("has folder inputs and list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-folders"));
    expect(screen.getByTestId("folder-name-input")).toBeTruthy();
    expect(screen.getByTestId("folder-list")).toBeTruthy();
    expect(screen.getByTestId("add-folder-btn")).toBeTruthy();
  });
});

describe("search page", () => {
  it("has search input and button", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-search"));
    expect(screen.getByTestId("search-input")).toBeTruthy();
    expect(screen.getByTestId("search-btn")).toBeTruthy();
    expect(screen.getByTestId("search-results")).toBeTruthy();
  });
});
