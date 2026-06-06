import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Add medication form", () => {
  it("renders all inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add"));
    expect(screen.getByTestId("input-name")).toBeTruthy();
    expect(screen.getByTestId("input-dosage")).toBeTruthy();
    expect(screen.getByTestId("input-frequency")).toBeTruthy();
    expect(screen.getByTestId("input-instructions")).toBeTruthy();
    expect(screen.getByTestId("submit-med")).toBeTruthy();
  });

  it("shows error when submitting empty form", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add"));
    fireEvent.click(screen.getByTestId("submit-med"));
    const err = await screen.findByTestId("form-error");
    expect(err).toBeTruthy();
  });
});

describe("Schedule page", () => {
  it("renders meds list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-schedule"));
    expect(screen.getByTestId("meds-list")).toBeTruthy();
  });
});
