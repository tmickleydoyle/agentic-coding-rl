import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders the navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to entries page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-entries"));
    expect(screen.getByTestId("entries-page")).toBeTruthy();
  });

  it("navigates to new-entry page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-new-entry"));
    expect(screen.getByTestId("new-entry-page")).toBeTruthy();
  });

  it("navigates to search page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-search"));
    expect(screen.getByTestId("search-page")).toBeTruthy();
  });

  it("go-new-entry button navigates to new entry page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("go-new-entry"));
    expect(screen.getByTestId("new-entry-page")).toBeTruthy();
  });
});
