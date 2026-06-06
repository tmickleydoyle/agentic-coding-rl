import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Drills", () => {
  function goToDrills() {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-drills"));
  }

  it("shows seed drills", () => {
    goToDrills();
    expect(screen.getByTestId("drill-item-d1")).toBeTruthy();
    expect(screen.getByTestId("drill-item-d2")).toBeTruthy();
  });

  it("shows drill percentage", () => {
    goToDrills();
    expect(screen.getByTestId("drill-pct-d1").textContent).toContain("90%");
  });

  it("logs a new drill", () => {
    goToDrills();
    fireEvent.change(screen.getByTestId("input-correct"), { target: { value: "8" } });
    fireEvent.change(screen.getByTestId("input-time"), { target: { value: "60" } });
    fireEvent.click(screen.getByTestId("btn-add-drill"));
    expect(screen.getByTestId("drill-count").textContent).toContain("3");
  });

  it("shows error if correct > total", () => {
    goToDrills();
    fireEvent.change(screen.getByTestId("input-correct"), { target: { value: "15" } });
    fireEvent.change(screen.getByTestId("input-time"), { target: { value: "60" } });
    fireEvent.click(screen.getByTestId("btn-add-drill"));
    expect(screen.getByTestId("drill-error")).toBeTruthy();
  });
});
