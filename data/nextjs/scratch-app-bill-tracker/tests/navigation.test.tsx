import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows dashboard by default", () => { render(<App />); expect(screen.getByTestId("dashboard-page")).toBeTruthy(); });
  it("navigates to bills", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-bills")); expect(screen.getByTestId("bills-page")).toBeTruthy(); });
  it("navigates to calendar", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-calendar")); expect(screen.getByTestId("calendar-page")).toBeTruthy(); });
  it("navigates to settings", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-settings")); expect(screen.getByTestId("settings-page")).toBeTruthy(); });
});
