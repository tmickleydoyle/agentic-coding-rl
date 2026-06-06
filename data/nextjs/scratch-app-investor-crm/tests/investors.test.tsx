import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

function goToInvestors() {
  render(<App />);
  fireEvent.click(screen.getByTestId("nav-investors"));
}

describe("Investors", () => {
  it("shows seed investors", () => {
    goToInvestors();
    expect(screen.getByTestId("investor-item-1")).toBeTruthy();
    expect(screen.getByTestId("investor-item-3")).toBeTruthy();
  });

  it("adds a new investor", () => {
    goToInvestors();
    fireEvent.change(screen.getByTestId("investor-name-input"), { target: { value: "Eve" } });
    fireEvent.change(screen.getByTestId("investor-firm-input"), { target: { value: "Tiger" } });
    fireEvent.change(screen.getByTestId("investor-email-input"), { target: { value: "eve@tiger.com" } });
    fireEvent.click(screen.getByTestId("add-investor-btn"));
    expect(screen.getByText("Eve")).toBeTruthy();
  });

  it("shows error for invalid email", () => {
    goToInvestors();
    fireEvent.change(screen.getByTestId("investor-name-input"), { target: { value: "Eve" } });
    fireEvent.change(screen.getByTestId("investor-firm-input"), { target: { value: "Tiger" } });
    fireEvent.change(screen.getByTestId("investor-email-input"), { target: { value: "notvalid" } });
    fireEvent.click(screen.getByTestId("add-investor-btn"));
    expect(screen.getByTestId("investor-error")).toBeTruthy();
  });

  it("deletes an investor", () => {
    goToInvestors();
    fireEvent.click(screen.getByTestId("delete-investor-1"));
    expect(screen.queryByTestId("investor-item-1")).toBeNull();
  });

  it("dashboard shows total investors", () => {
    render(<App />);
    expect(screen.getByTestId("total-investors").textContent).toContain("4");
  });
});
