import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows home by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to pages", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-pages"));
    expect(screen.getByTestId("pages-page")).toBeTruthy();
  });

  it("navigates to categories", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-categories"));
    expect(screen.getByTestId("categories-page")).toBeTruthy();
  });

  it("navigates to search", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-search"));
    expect(screen.getByTestId("search-page")).toBeTruthy();
  });
});
