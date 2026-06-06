import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows research page by default", () => {
    render(<App />);
    expect(screen.getByTestId("research-page")).toBeTruthy();
  });

  it("navigates to sources page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-sources"));
    expect(screen.getByTestId("sources-page")).toBeTruthy();
  });

  it("navigates to tags page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tags"));
    expect(screen.getByTestId("tags-page")).toBeTruthy();
  });

  it("navigates to search page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-search"));
    expect(screen.getByTestId("search-page")).toBeTruthy();
  });

  it("navigates back to notes", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-sources"));
    fireEvent.click(screen.getByTestId("nav-research"));
    expect(screen.getByTestId("research-page")).toBeTruthy();
  });
});
