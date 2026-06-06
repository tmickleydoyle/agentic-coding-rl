import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to add page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add"));
    expect(screen.getByTestId("add-page")).toBeTruthy();
  });

  it("navigates to reactions page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reactions"));
    expect(screen.getByTestId("reactions-page")).toBeTruthy();
  });

  it("navigates to triggers page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-triggers"));
    expect(screen.getByTestId("triggers-page")).toBeTruthy();
  });

  it("go-add button navigates to add page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("go-add"));
    expect(screen.getByTestId("add-page")).toBeTruthy();
  });
});
