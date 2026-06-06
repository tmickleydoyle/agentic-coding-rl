import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Profile", () => {
  it("shows athlete name", () => {
    render(<App />);
    expect(screen.getByTestId("profile-name").textContent).toContain("Jordan Smith");
  });

  it("enters edit mode", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-edit-profile"));
    expect(screen.getByTestId("profile-edit-form")).toBeTruthy();
  });

  it("saves profile changes", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-edit-profile"));
    fireEvent.change(screen.getByTestId("input-profile-name"), { target: { value: "Jamie Lee" } });
    fireEvent.click(screen.getByTestId("btn-save-profile"));
    expect(screen.getByTestId("profile-name").textContent).toContain("Jamie Lee");
  });

  it("events page shows podium badge for place <= 3", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    expect(screen.getByTestId("event-podium-e2")).toBeTruthy();
  });

  it("no podium badge for place > 3", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    expect(screen.queryByTestId("event-podium-e1")).toBeNull();
  });

  it("achievements page shows seed achievement", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-achievements"));
    expect(screen.getByTestId("achievement-item-ac1")).toBeTruthy();
  });

  it("adds achievement", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-achievements"));
    fireEvent.change(screen.getByTestId("input-achievement-title"), { target: { value: "New Award" } });
    fireEvent.click(screen.getByTestId("btn-add-achievement"));
    expect(screen.getByText("New Award")).toBeTruthy();
  });
});
