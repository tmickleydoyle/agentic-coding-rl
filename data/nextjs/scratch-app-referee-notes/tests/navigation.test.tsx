import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";
beforeEach(() => { __reset(); cleanup(); });
describe("navigation", () => {
  it("renders matches by default", () => {
    render(<App />);
    expect(screen.getByTestId("matches-page")).toBeTruthy();
  });
  it("navigates to flags", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-flags"));
    expect(screen.getByTestId("flags-page")).toBeTruthy();
  });
  it("navigates to reports", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reports"));
    expect(screen.getByTestId("reports-page")).toBeTruthy();
  });
});
