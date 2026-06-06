import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Team Wiki", () => {
  it("shows total page count on home", () => {
    render(<App />);
    expect(screen.getByTestId("total-pages").textContent).toContain("4");
  });

  it("shows recent pages (newest first)", () => {
    render(<App />);
    expect(screen.getByTestId("recent-page-4")).toBeTruthy(); // Team Norms is newest
  });

  it("shows seed pages in pages list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-pages"));
    expect(screen.getByTestId("page-item-1")).toBeTruthy();
    expect(screen.getByTestId("page-item-4")).toBeTruthy();
  });

  it("adds a new page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-pages"));
    fireEvent.change(screen.getByTestId("page-title-input"), { target: { value: "New Policy" } });
    fireEvent.change(screen.getByTestId("page-author-input"), { target: { value: "Eve" } });
    fireEvent.change(screen.getByTestId("page-category-select"), { target: { value: "Operations" } });
    fireEvent.click(screen.getByTestId("add-page-btn"));
    expect(screen.getByText("New Policy")).toBeTruthy();
  });

  it("shows error for duplicate title", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-pages"));
    fireEvent.change(screen.getByTestId("page-title-input"), { target: { value: "Team Norms" } });
    fireEvent.change(screen.getByTestId("page-author-input"), { target: { value: "Eve" } });
    fireEvent.change(screen.getByTestId("page-category-select"), { target: { value: "Culture" } });
    fireEvent.click(screen.getByTestId("add-page-btn"));
    expect(screen.getByTestId("page-error")).toBeTruthy();
  });

  it("search finds pages by title", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-search"));
    fireEvent.change(screen.getByTestId("search-input"), { target: { value: "design" } });
    expect(screen.getByTestId("search-result-3")).toBeTruthy();
  });

  it("search returns all pages when query empty", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-search"));
    expect(screen.getByTestId("search-count").textContent).toContain("4");
  });

  it("cannot delete category in use", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-categories"));
    fireEvent.click(screen.getByTestId("delete-category-1")); // Engineering in use
    expect(screen.getByTestId("category-error")).toBeTruthy();
  });
});
