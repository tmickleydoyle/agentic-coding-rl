import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    json: async () => ({ posts: [] }),
  }));
});

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to posts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-posts"));
    expect(screen.getByTestId("posts-page")).toBeTruthy();
  });

  it("navigates to ideas", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-ideas"));
    expect(screen.getByTestId("ideas-page")).toBeTruthy();
  });

  it("navigates to schedule", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-schedule"));
    expect(screen.getByTestId("schedule-page")).toBeTruthy();
  });
});
