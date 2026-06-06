import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders home by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to lists", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-lists"));
    expect(screen.getByTestId("lists-page")).toBeTruthy();
  });

  it("navigates to add-list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-list"));
    expect(screen.getByTestId("add-list-page")).toBeTruthy();
  });

  it("navigates to checklist", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-checklist"));
    expect(screen.getByTestId("checklist-page")).toBeTruthy();
  });
});
