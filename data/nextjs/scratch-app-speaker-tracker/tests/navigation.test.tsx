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
    expect(screen.getByTestId("nav-speakers")).toBeTruthy();
    expect(screen.getByTestId("nav-talks")).toBeTruthy();
    expect(screen.getByTestId("nav-events")).toBeTruthy();
  });

  it("starts on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to speakers", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-speakers"));
    expect(screen.getByTestId("speakers-page")).toBeTruthy();
  });

  it("navigates to talks", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-talks"));
    expect(screen.getByTestId("talks-page")).toBeTruthy();
  });

  it("navigates to events", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    expect(screen.getByTestId("events-page")).toBeTruthy();
  });
});
