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
    expect(screen.getByTestId("nav-skills")).toBeTruthy();
    expect(screen.getByTestId("nav-progress")).toBeTruthy();
    expect(screen.getByTestId("nav-resources")).toBeTruthy();
  });

  it("starts on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to skills", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-skills"));
    expect(screen.getByTestId("skills-page")).toBeTruthy();
  });

  it("navigates to progress", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    expect(screen.getByTestId("progress-page")).toBeTruthy();
  });

  it("navigates to resources", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-resources"));
    expect(screen.getByTestId("resources-page")).toBeTruthy();
  });
});
