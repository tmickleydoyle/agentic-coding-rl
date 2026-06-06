import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders calendar page by default", () => {
    render(<App />);
    expect(screen.getByTestId("calendar-page")).toBeTruthy();
  });

  it("navigates to create page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-create"));
    expect(screen.getByTestId("create-page")).toBeTruthy();
  });

  it("navigates to registrations page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-registrations"));
    expect(screen.getByTestId("registrations-page")).toBeTruthy();
  });
});
