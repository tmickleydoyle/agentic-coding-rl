import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Record page", () => {
  it("renders all form inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-record"));
    expect(screen.getByTestId("input-systolic")).toBeTruthy();
    expect(screen.getByTestId("input-diastolic")).toBeTruthy();
    expect(screen.getByTestId("input-pulse")).toBeTruthy();
    expect(screen.getByTestId("input-note")).toBeTruthy();
    expect(screen.getByTestId("submit-reading")).toBeTruthy();
  });

  it("shows error on empty submit", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-record"));
    fireEvent.click(screen.getByTestId("submit-reading"));
    const err = await screen.findByTestId("form-error");
    expect(err).toBeTruthy();
  });
});
