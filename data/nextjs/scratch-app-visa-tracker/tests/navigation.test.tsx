import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders home by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to visas", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-visas"));
    expect(screen.getByTestId("visas-page")).toBeTruthy();
  });

  it("navigates to add-visa", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-visa"));
    expect(screen.getByTestId("add-visa-page")).toBeTruthy();
  });

  it("navigates to reminders", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reminders"));
    expect(screen.getByTestId("reminders-page")).toBeTruthy();
  });
});
