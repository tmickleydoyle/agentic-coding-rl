import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Navigation", () => {
  it("renders navbar with all nav links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-dashboard")).toBeTruthy();
    expect(screen.getByTestId("nav-contacts")).toBeTruthy();
    expect(screen.getByTestId("nav-notes")).toBeTruthy();
    expect(screen.getByTestId("nav-tags")).toBeTruthy();
  });

  it("starts on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to contacts page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contacts"));
    expect(screen.getByTestId("contacts-page")).toBeTruthy();
  });

  it("navigates to notes page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-notes"));
    expect(screen.getByTestId("notes-page")).toBeTruthy();
  });

  it("navigates to tags page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tags"));
    expect(screen.getByTestId("tags-page")).toBeTruthy();
  });
});
