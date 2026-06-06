import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders navbar with all links", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
    expect(screen.getByTestId("nav-home")).toBeTruthy();
    expect(screen.getByTestId("nav-vocabulary")).toBeTruthy();
    expect(screen.getByTestId("nav-partners")).toBeTruthy();
    expect(screen.getByTestId("nav-sessions")).toBeTruthy();
  });

  it("shows home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to vocabulary page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-vocabulary"));
    expect(screen.getByTestId("vocabulary-page")).toBeTruthy();
  });

  it("navigates to partners page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-partners"));
    expect(screen.getByTestId("partners-page")).toBeTruthy();
  });

  it("navigates to sessions page", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-sessions"));
    expect(screen.getByTestId("sessions-page")).toBeTruthy();
  });
});
