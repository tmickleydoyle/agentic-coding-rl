import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders clauses page by default", () => {
    render(<App />);
    expect(screen.getByTestId("clauses-page")).toBeTruthy();
  });

  it("has navbar with all links", () => {
    render(<App />);
    expect(screen.getByTestId("nav-clauses")).toBeTruthy();
    expect(screen.getByTestId("nav-witnesses")).toBeTruthy();
    expect(screen.getByTestId("nav-summary")).toBeTruthy();
  });

  it("navigates to witnesses", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-witnesses"));
    expect(screen.getByTestId("witnesses-page")).toBeTruthy();
  });

  it("navigates to summary", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("summary-page")).toBeTruthy();
  });

  it("navigates back to clauses", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-witnesses"));
    fireEvent.click(screen.getByTestId("nav-clauses"));
    expect(screen.getByTestId("clauses-page")).toBeTruthy();
  });
});
