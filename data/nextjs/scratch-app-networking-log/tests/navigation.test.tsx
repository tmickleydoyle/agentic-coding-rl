import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders all nav links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-dashboard")).toBeTruthy();
    expect(screen.getByTestId("nav-events")).toBeTruthy();
    expect(screen.getByTestId("nav-connections")).toBeTruthy();
    expect(screen.getByTestId("nav-followups")).toBeTruthy();
  });

  it("starts on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to events", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    expect(screen.getByTestId("events-page")).toBeTruthy();
  });

  it("navigates to connections", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-connections"));
    expect(screen.getByTestId("connections-page")).toBeTruthy();
  });

  it("navigates to followups", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-followups"));
    expect(screen.getByTestId("followups-page")).toBeTruthy();
  });
});
