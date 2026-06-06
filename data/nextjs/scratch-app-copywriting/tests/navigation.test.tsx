import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ projects: [], briefs: [], copies: [] }) }));
});

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows projects by default", () => { render(<App />); expect(screen.getByTestId("projects-page")).toBeTruthy(); });
  it("navigates to briefs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-briefs"));
    expect(screen.getByTestId("briefs-page")).toBeTruthy();
  });
  it("navigates to copies", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-copies"));
    expect(screen.getByTestId("copies-page")).toBeTruthy();
  });
  it("navigates to review", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-review"));
    expect(screen.getByTestId("review-page")).toBeTruthy();
  });
});
