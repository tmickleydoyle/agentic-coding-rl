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

  it("navigates to record page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-record"));
    expect(screen.getByTestId("record-page")).toBeTruthy();
  });

  it("navigates to history page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("history-page")).toBeTruthy();
  });

  it("navigates to trends page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trends"));
    expect(screen.getByTestId("trends-page")).toBeTruthy();
  });

  it("go-record button navigates to record page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("go-record"));
    expect(screen.getByTestId("record-page")).toBeTruthy();
  });
});
