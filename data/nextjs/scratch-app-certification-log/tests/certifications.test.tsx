import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Dashboard", () => {
  it("shows earned count", () => {
    render(<App />);
    expect(screen.getByTestId("earned-count").textContent).toBe("1");
  });

  it("shows in-progress count", () => {
    render(<App />);
    expect(screen.getByTestId("inprogress-count").textContent).toBe("1");
  });

  it("shows no scheduled exam when none future", () => {
    render(<App />);
    expect(screen.getByTestId("next-exam").textContent).toBe("None scheduled");
  });
});

describe("Certifications page", () => {
  it("lists all certifications", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-certifications"));
    const items = screen.getAllByTestId("cert-item");
    expect(items.length).toBe(3);
  });

  it("filters by status", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-certifications"));
    fireEvent.change(screen.getByTestId("status-filter"), { target: { value: "earned" } });
    const items = screen.getAllByTestId("cert-item");
    expect(items.length).toBe(1);
  });

  it("adds a certification", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-certifications"));
    fireEvent.change(screen.getByTestId("cert-name-input"), { target: { value: "Azure Fundamentals" } });
    fireEvent.change(screen.getByTestId("cert-provider-input"), { target: { value: "Microsoft" } });
    fireEvent.click(screen.getByTestId("add-cert-btn"));
    const items = screen.getAllByTestId("cert-item");
    expect(items.length).toBe(4);
  });
});

describe("Exams page", () => {
  it("shows all exams", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-exams"));
    const items = screen.getAllByTestId("exam-item");
    expect(items.length).toBe(2);
  });

  it("filters passed exams", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-exams"));
    fireEvent.click(screen.getByTestId("filter-passed"));
    const items = screen.getAllByTestId("exam-item");
    expect(items.length).toBe(1);
  });

  it("shows pass and fail badges", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-exams"));
    expect(screen.getByTestId("pass-badge")).toBeTruthy();
    expect(screen.getByTestId("fail-badge")).toBeTruthy();
  });
});
