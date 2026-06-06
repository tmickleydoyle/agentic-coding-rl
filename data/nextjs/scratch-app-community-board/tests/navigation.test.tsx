import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders posts page by default", () => {
    render(<App />);
    expect(screen.getByTestId("posts-page")).toBeTruthy();
  });

  it("navigates to members page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-members"));
    expect(screen.getByTestId("members-page")).toBeTruthy();
  });

  it("navigates to events page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    expect(screen.getByTestId("events-page")).toBeTruthy();
  });

  it("navbar always visible", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });
});
