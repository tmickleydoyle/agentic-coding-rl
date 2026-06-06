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
    expect(screen.getByTestId("nav-certifications")).toBeTruthy();
    expect(screen.getByTestId("nav-study")).toBeTruthy();
    expect(screen.getByTestId("nav-exams")).toBeTruthy();
  });

  it("starts on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to certifications", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-certifications"));
    expect(screen.getByTestId("certifications-page")).toBeTruthy();
  });

  it("navigates to study", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-study"));
    expect(screen.getByTestId("study-page")).toBeTruthy();
  });

  it("navigates to exams", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-exams"));
    expect(screen.getByTestId("exams-page")).toBeTruthy();
  });
});
