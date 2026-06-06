import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("renders navbar with all links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-dashboard")).toBeTruthy();
    expect(screen.getByTestId("nav-assets")).toBeTruthy();
    expect(screen.getByTestId("nav-beneficiaries")).toBeTruthy();
    expect(screen.getByTestId("nav-notes")).toBeTruthy();
  });

  it("navigates to assets page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assets"));
    expect(screen.getByTestId("assets-page")).toBeTruthy();
  });

  it("navigates to beneficiaries page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-beneficiaries"));
    expect(screen.getByTestId("beneficiaries-page")).toBeTruthy();
  });

  it("navigates to notes page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-notes"));
    expect(screen.getByTestId("notes-page")).toBeTruthy();
  });

  it("navigates back to dashboard", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assets"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });
});
