import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Sessions", () => {
  it("shows seed sessions", () => {
    render(<App />);
    expect(screen.getByTestId("session-item-s1")).toBeTruthy();
    expect(screen.getByTestId("session-item-s2")).toBeTruthy();
  });

  it("adds a new session", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("input-session-name"), { target: { value: "Leg Day" } });
    fireEvent.click(screen.getByTestId("btn-add-session"));
    expect(screen.getByText("Leg Day")).toBeTruthy();
  });

  it("deletes a session", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-delete-s1"));
    expect(screen.queryByTestId("session-item-s1")).toBeNull();
  });

  it("selects active session", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-select-s1"));
    expect(screen.getByTestId("active-indicator")).toBeTruthy();
  });

  it("exercises page shows no-active-session when none selected", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-exercises"));
    expect(screen.getByTestId("no-active-session")).toBeTruthy();
  });

  it("exercises page shows form when session active", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-select-s1"));
    fireEvent.click(screen.getByTestId("nav-exercises"));
    expect(screen.getByTestId("add-exercise-form")).toBeTruthy();
  });

  it("adds exercise to active session", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-select-s1"));
    fireEvent.click(screen.getByTestId("nav-exercises"));
    fireEvent.change(screen.getByTestId("input-exercise-name"), { target: { value: "Squat" } });
    fireEvent.change(screen.getByTestId("input-sets"), { target: { value: "4" } });
    fireEvent.change(screen.getByTestId("input-reps"), { target: { value: "6" } });
    fireEvent.change(screen.getByTestId("input-weight"), { target: { value: "100" } });
    fireEvent.click(screen.getByTestId("btn-add-exercise"));
    expect(screen.getByText("Squat")).toBeTruthy();
  });
});
