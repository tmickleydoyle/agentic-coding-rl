import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Overview", () => {
  it("shows total deductions", () => {
    render(<App />);
    // 1500+800+2200 = 4500
    expect(screen.getByTestId("total-deductions").textContent).toContain("4500.00");
  });
  it("shows doc count", () => {
    render(<App />);
    expect(screen.getByTestId("doc-count").textContent).toBe("2");
  });
  it("shows tax year", () => {
    render(<App />);
    expect(screen.getByTestId("tax-year").textContent).toBe("2023");
  });
});

describe("Documents", () => {
  it("lists seed docs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-documents"));
    expect(screen.getByTestId("doc-doc1")).toBeTruthy();
    expect(screen.getByTestId("doc-doc2")).toBeTruthy();
  });
  it("adds a document", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-documents"));
    fireEvent.change(screen.getByTestId("doc-name"), { target: { value: "1098 Mortgage" } });
    fireEvent.change(screen.getByTestId("doc-amount"), { target: { value: "12000" } });
    fireEvent.click(screen.getByTestId("add-doc-btn"));
    expect(screen.getByText("1098 Mortgage")).toBeTruthy();
  });
  it("deletes a document", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-documents"));
    fireEvent.click(screen.getByTestId("delete-doc-doc2"));
    expect(screen.queryByTestId("doc-doc2")).toBeNull();
  });
});

describe("Deductions", () => {
  it("lists all seed deductions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-deductions"));
    expect(screen.getByTestId("deduction-ded1")).toBeTruthy();
    expect(screen.getByTestId("deduction-ded2")).toBeTruthy();
    expect(screen.getByTestId("deduction-ded3")).toBeTruthy();
  });
  it("adds a deduction", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-deductions"));
    fireEvent.change(screen.getByTestId("deduction-description"), { target: { value: "Tuition" } });
    fireEvent.change(screen.getByTestId("deduction-amount"), { target: { value: "5000" } });
    fireEvent.click(screen.getByTestId("add-deduction-btn"));
    expect(screen.getByText("Tuition")).toBeTruthy();
  });
});

describe("Notes", () => {
  it("shows seed note", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-notes"));
    expect(screen.getByTestId("note-n1")).toBeTruthy();
  });
  it("adds a note", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-notes"));
    fireEvent.change(screen.getByTestId("note-title"), { target: { value: "Extension" } });
    fireEvent.change(screen.getByTestId("note-content"), { target: { value: "Request extension if needed" } });
    fireEvent.change(screen.getByTestId("note-date"), { target: { value: "2024-03-01" } });
    fireEvent.click(screen.getByTestId("add-note-btn"));
    expect(screen.getByText("Extension")).toBeTruthy();
  });
});
