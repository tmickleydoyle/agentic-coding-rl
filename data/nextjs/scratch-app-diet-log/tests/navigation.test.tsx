import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("shows log by default", () => {
    render(<App />);
    expect(screen.getByTestId("entry-count")).toBeTruthy();
  });

  it("nav buttons exist", () => {
    render(<App />);
    expect(screen.getByTestId("nav-log")).toBeTruthy();
    expect(screen.getByTestId("nav-add-entry")).toBeTruthy();
    expect(screen.getByTestId("nav-summary")).toBeTruthy();
  });

  it("navigates to add-entry", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-entry"));
    expect(screen.getByTestId("add-entry-form")).toBeTruthy();
  });

  it("navigates to summary", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("summary-calories")).toBeTruthy();
  });
});
