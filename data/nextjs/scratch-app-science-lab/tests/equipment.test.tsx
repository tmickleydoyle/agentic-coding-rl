import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Equipment", () => {
  function goToEquipment() {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-equipment"));
  }

  it("shows seed equipment", () => {
    goToEquipment();
    expect(screen.getByTestId("equipment-item-eq1")).toBeTruthy();
    expect(screen.getByTestId("equipment-item-eq4")).toBeTruthy();
  });

  it("shows available count", () => {
    goToEquipment();
    expect(screen.getByTestId("available-count").textContent).toContain("2");
  });

  it("adds new equipment", () => {
    goToEquipment();
    fireEvent.change(screen.getByTestId("input-eq-name"), { target: { value: "Thermometer" } });
    fireEvent.change(screen.getByTestId("input-category"), { target: { value: "Measurement" } });
    fireEvent.change(screen.getByTestId("input-location"), { target: { value: "Lab C" } });
    fireEvent.click(screen.getByTestId("btn-add-equipment"));
    expect(screen.getByTestId("equipment-list").textContent).toContain("Thermometer");
  });

  it("shows error on empty form", () => {
    goToEquipment();
    fireEvent.click(screen.getByTestId("btn-add-equipment"));
    expect(screen.getByTestId("equipment-error")).toBeTruthy();
  });
});
