import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders inventory by default", () => {
    render(<App />);
    expect(screen.getByTestId("inventory-page")).toBeTruthy();
  });
  it("navigates to donations", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-donations"));
    expect(screen.getByTestId("donations-page")).toBeTruthy();
  });
  it("navigates to clients", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-clients"));
    expect(screen.getByTestId("clients-page")).toBeTruthy();
  });
});
