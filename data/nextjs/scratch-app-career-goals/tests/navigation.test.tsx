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
    expect(screen.getByTestId("nav-milestones")).toBeTruthy();
    expect(screen.getByTestId("nav-applications")).toBeTruthy();
    expect(screen.getByTestId("nav-skills")).toBeTruthy();
  });

  it("starts on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to milestones", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-milestones"));
    expect(screen.getByTestId("milestones-page")).toBeTruthy();
  });

  it("navigates to applications", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-applications"));
    expect(screen.getByTestId("applications-page")).toBeTruthy();
  });

  it("navigates to skills", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-skills"));
    expect(screen.getByTestId("skills-page")).toBeTruthy();
  });
});
