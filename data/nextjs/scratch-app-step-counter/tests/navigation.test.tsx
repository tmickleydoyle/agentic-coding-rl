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

  it("navigates to log page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log"));
    expect(screen.getByTestId("log-page")).toBeTruthy();
  });

  it("navigates to history page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("history-page")).toBeTruthy();
  });

  it("navigates to goals page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    expect(screen.getByTestId("goals-page")).toBeTruthy();
  });

  it("go-log button navigates to log page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("go-log"));
    expect(screen.getByTestId("log-page")).toBeTruthy();
  });
});
