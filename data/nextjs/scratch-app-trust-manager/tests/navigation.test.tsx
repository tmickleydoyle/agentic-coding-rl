import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("shows trusts page by default", () => {
    render(<App />);
    expect(screen.getByTestId("trusts-page")).toBeTruthy();
  });

  it("has all nav links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-trusts")).toBeTruthy();
    expect(screen.getByTestId("nav-distributions")).toBeTruthy();
    expect(screen.getByTestId("nav-overview")).toBeTruthy();
  });

  it("navigates to distributions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-distributions"));
    expect(screen.getByTestId("distributions-page")).toBeTruthy();
  });

  it("navigates to overview", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-overview"));
    expect(screen.getByTestId("overview-page")).toBeTruthy();
  });

  it("navigates back to trusts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-overview"));
    fireEvent.click(screen.getByTestId("nav-trusts"));
    expect(screen.getByTestId("trusts-page")).toBeTruthy();
  });
});
