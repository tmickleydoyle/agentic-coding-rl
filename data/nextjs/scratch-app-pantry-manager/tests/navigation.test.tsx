import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders inventory by default", () => {
    render(<App />);
    expect(screen.getByTestId("total-items")).toBeTruthy();
  });

  it("nav buttons exist", () => {
    render(<App />);
    expect(screen.getByTestId("nav-inventory")).toBeTruthy();
    expect(screen.getByTestId("nav-add-item")).toBeTruthy();
    expect(screen.getByTestId("nav-low-stock")).toBeTruthy();
  });

  it("navigates to add-item", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-item"));
    expect(screen.getByTestId("add-item-form")).toBeTruthy();
  });

  it("navigates to low-stock", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-low-stock"));
    expect(screen.getByTestId("low-stock-count")).toBeTruthy();
  });
});
