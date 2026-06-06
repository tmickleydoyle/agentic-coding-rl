import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Add allergy form", () => {
  it("renders all inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add"));
    expect(screen.getByTestId("input-name")).toBeTruthy();
    expect(screen.getByTestId("input-type")).toBeTruthy();
    expect(screen.getByTestId("input-severity")).toBeTruthy();
    expect(screen.getByTestId("input-symptoms")).toBeTruthy();
    expect(screen.getByTestId("input-notes")).toBeTruthy();
    expect(screen.getByTestId("submit-allergy")).toBeTruthy();
  });

  it("shows error when submitting empty form", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add"));
    fireEvent.click(screen.getByTestId("submit-allergy"));
    const err = await screen.findByTestId("form-error");
    expect(err).toBeTruthy();
  });
});

describe("Reactions page", () => {
  it("renders reaction form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reactions"));
    expect(screen.getByTestId("reaction-form")).toBeTruthy();
    expect(screen.getByTestId("submit-reaction")).toBeTruthy();
  });

  it("shows error when submitting empty reaction", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reactions"));
    fireEvent.click(screen.getByTestId("submit-reaction"));
    const err = await screen.findByTestId("form-error");
    expect(err).toBeTruthy();
  });
});
