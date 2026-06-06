import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("shows tasks page by default", () => {
    render(<App />);
    expect(screen.getByTestId("tasks-page")).toBeTruthy();
  });

  it("has all nav links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-tasks")).toBeTruthy();
    expect(screen.getByTestId("nav-contacts")).toBeTruthy();
    expect(screen.getByTestId("nav-progress")).toBeTruthy();
  });

  it("navigates to contacts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contacts"));
    expect(screen.getByTestId("contacts-page")).toBeTruthy();
  });

  it("navigates to progress", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    expect(screen.getByTestId("progress-page")).toBeTruthy();
  });
});
