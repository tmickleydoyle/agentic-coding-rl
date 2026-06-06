import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows overview by default", () => { render(<App />); expect(screen.getByTestId("overview-page")).toBeTruthy(); });
  it("navigates to debts", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-debts")); expect(screen.getByTestId("debts-page")).toBeTruthy(); });
  it("navigates to payments", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-payments")); expect(screen.getByTestId("payments-page")).toBeTruthy(); });
  it("navigates to strategy", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-strategy")); expect(screen.getByTestId("strategy-page")).toBeTruthy(); });
});
