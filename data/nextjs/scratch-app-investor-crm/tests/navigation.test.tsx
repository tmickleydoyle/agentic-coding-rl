import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to investors", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-investors"));
    expect(screen.getByTestId("investors-page")).toBeTruthy();
  });

  it("navigates to interactions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-interactions"));
    expect(screen.getByTestId("interactions-page")).toBeTruthy();
  });

  it("navigates to pipeline", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-pipeline"));
    expect(screen.getByTestId("pipeline-page")).toBeTruthy();
  });
});
