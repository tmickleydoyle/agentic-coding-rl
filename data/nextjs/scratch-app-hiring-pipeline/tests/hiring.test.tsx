import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Hiring Pipeline", () => {
  it("shows open roles count on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("open-roles").textContent).toContain("2");
  });

  it("shows total candidates on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("total-candidates").textContent).toContain("4");
  });

  it("shows seed jobs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-jobs"));
    expect(screen.getByTestId("job-item-1")).toBeTruthy();
    expect(screen.getByTestId("job-item-3")).toBeTruthy();
  });

  it("adds a job", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-jobs"));
    fireEvent.change(screen.getByTestId("job-title-input"), { target: { value: "Data Scientist" } });
    fireEvent.click(screen.getByTestId("add-job-btn"));
    expect(screen.getByText("Data Scientist")).toBeTruthy();
  });

  it("cannot add candidate to closed job", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-candidates"));
    fireEvent.change(screen.getByTestId("candidate-name-input"), { target: { value: "Eve" } });
    fireEvent.change(screen.getByTestId("candidate-email-input"), { target: { value: "eve@test.com" } });
    fireEvent.change(screen.getByTestId("candidate-job-select"), { target: { value: "3" } });
    fireEvent.click(screen.getByTestId("add-candidate-btn"));
    expect(screen.getByTestId("candidate-error")).toBeTruthy();
  });

  it("shows error for invalid email", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-candidates"));
    fireEvent.change(screen.getByTestId("candidate-name-input"), { target: { value: "Eve" } });
    fireEvent.change(screen.getByTestId("candidate-email-input"), { target: { value: "notvalid" } });
    fireEvent.change(screen.getByTestId("candidate-job-select"), { target: { value: "1" } });
    fireEvent.click(screen.getByTestId("add-candidate-btn"));
    expect(screen.getByTestId("candidate-error")).toBeTruthy();
  });
});
