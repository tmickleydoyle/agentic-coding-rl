import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Bookings", () => {
  function goToBookings() {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bookings"));
  }

  it("shows seed bookings", () => {
    goToBookings();
    expect(screen.getByTestId("booking-item-b1")).toBeTruthy();
    expect(screen.getByTestId("booking-item-b2")).toBeTruthy();
  });

  it("shows booking status", () => {
    goToBookings();
    expect(screen.getByTestId("booking-status-b1").textContent).toBe("confirmed");
  });

  it("confirms a booking", () => {
    goToBookings();
    fireEvent.click(screen.getByTestId("btn-confirm-b2"));
    expect(screen.getByTestId("booking-status-b2").textContent).toBe("confirmed");
  });

  it("cancels a booking", () => {
    goToBookings();
    fireEvent.click(screen.getByTestId("btn-cancel-b1"));
    expect(screen.getByTestId("booking-status-b1").textContent).toBe("cancelled");
  });

  it("shows error on empty form submit", () => {
    goToBookings();
    fireEvent.click(screen.getByTestId("btn-add-booking"));
    expect(screen.getByTestId("booking-error")).toBeTruthy();
  });
});
