import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows dashboard by default", () => { render(<App />); expect(screen.getByTestId("dashboard-page")).toBeTruthy(); });
  it("navigates to goals", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-goals")); expect(screen.getByTestId("goals-page")).toBeTruthy(); });
  it("navigates to milestones", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-milestones")); expect(screen.getByTestId("milestones-page")).toBeTruthy(); });
  it("navigates to insights", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-insights")); expect(screen.getByTestId("insights-page")).toBeTruthy(); });
});
