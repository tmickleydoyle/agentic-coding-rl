import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ projects: [], briefs: [], copies: [] }) }));
});

describe("Copywriting UI", () => {
  it("shows no-projects when empty", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("no-projects")).toBeTruthy());
  });
  it("add-project-form exists", () => {
    render(<App />);
    expect(screen.getByTestId("add-project-form")).toBeTruthy();
  });
  it("review page shows no-review when empty", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-review"));
    await waitFor(() => expect(screen.getByTestId("no-review")).toBeTruthy());
  });
  it("copies page has add-copy-form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-copies"));
    expect(screen.getByTestId("add-copy-form")).toBeTruthy();
  });
  it("briefs page has add-brief-form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-briefs"));
    expect(screen.getByTestId("add-brief-form")).toBeTruthy();
  });
});
