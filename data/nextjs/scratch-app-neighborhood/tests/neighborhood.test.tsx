import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

describe("Directory Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed residents", () => {
    render(<App />);
    expect(screen.getByTestId("resident-row-res1")).toBeTruthy();
    expect(screen.getByTestId("resident-row-res3")).toBeTruthy();
  });

  it("shows resident name", () => {
    render(<App />);
    expect(screen.getByTestId("resident-name-res1").textContent).toBe("Alice Johnson");
  });

  it("adds a new resident", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("resident-name"), { target: { value: "Dave Lee" } });
    fireEvent.click(screen.getByTestId("resident-submit"));
    expect(screen.getByText("Dave Lee")).toBeTruthy();
  });
});

describe("Issues Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed issues", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-issues"));
    expect(screen.getByTestId("issue-row-i1")).toBeTruthy();
    expect(screen.getByTestId("issue-row-i2")).toBeTruthy();
  });

  it("shows issue status", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-issues"));
    expect(screen.getByTestId("issue-status-i1").textContent).toBe("Open");
  });

  it("updates issue status", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-issues"));
    fireEvent.change(screen.getByTestId("issue-status-select-i1"), { target: { value: "Resolved" } });
    expect(screen.getByTestId("issue-status-i1").textContent).toBe("Resolved");
  });
});

describe("Announcements Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed announcements", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-announcements"));
    expect(screen.getByTestId("ann-row-ann1")).toBeTruthy();
  });

  it("shows pinned badge for pinned announcement", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-announcements"));
    expect(screen.getByTestId("ann-pinned-ann1")).toBeTruthy();
  });

  it("toggles pin", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-announcements"));
    fireEvent.click(screen.getByTestId("ann-pin-btn-ann2"));
    expect(screen.getByTestId("ann-pinned-ann2")).toBeTruthy();
  });
});
