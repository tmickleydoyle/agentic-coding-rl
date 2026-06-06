import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders schedule by default", () => {
    render(<App />);
    expect(screen.getByTestId("total-supplements")).toBeTruthy();
  });

  it("nav buttons exist", () => {
    render(<App />);
    expect(screen.getByTestId("nav-schedule")).toBeTruthy();
    expect(screen.getByTestId("nav-add-supplement")).toBeTruthy();
    expect(screen.getByTestId("nav-log-dose")).toBeTruthy();
  });

  it("navigates to add-supplement", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-supplement"));
    expect(screen.getByTestId("add-supplement-form")).toBeTruthy();
  });

  it("navigates to log-dose", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log-dose"));
    expect(screen.getByTestId("log-dose-form")).toBeTruthy();
  });
});
