import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Cap Table", () => {
  it("shows total shares on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("total-shares").textContent).toContain("9,100,000");
  });

  it("shows equity value using latest round price", () => {
    render(<App />);
    // 9,100,000 shares * $5 = $45,500,000
    expect(screen.getByTestId("total-value").textContent).toContain("45,500,000");
  });

  it("shows ownership percentages", () => {
    render(<App />);
    const alicePct = screen.getByTestId("ownership-pct-1");
    expect(alicePct.textContent).toContain("43.96");
  });

  it("adds a shareholder", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-shareholders"));
    fireEvent.change(screen.getByTestId("shareholder-name-input"), { target: { value: "New Emp" } });
    fireEvent.change(screen.getByTestId("shareholder-shares-input"), { target: { value: "500000" } });
    fireEvent.click(screen.getByTestId("add-shareholder-btn"));
    expect(screen.getByText("New Emp")).toBeTruthy();
  });

  it("shows error for zero shares", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-shareholders"));
    fireEvent.change(screen.getByTestId("shareholder-name-input"), { target: { value: "Test" } });
    fireEvent.change(screen.getByTestId("shareholder-shares-input"), { target: { value: "0" } });
    fireEvent.click(screen.getByTestId("add-shareholder-btn"));
    expect(screen.getByTestId("shareholder-error")).toBeTruthy();
  });

  it("dilution calculator updates post percentages", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-dilution"));
    fireEvent.change(screen.getByTestId("dilution-new-shares-input"), { target: { value: "900000" } });
    const post = screen.getByTestId("dilution-post-1");
    expect(post.textContent).not.toBe("-");
  });
});
