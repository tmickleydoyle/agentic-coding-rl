import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows summary by default", () => { render(<App />); expect(screen.getByTestId("summary-page")).toBeTruthy(); });
  it("navigates to assets", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-assets")); expect(screen.getByTestId("assets-page")).toBeTruthy(); });
  it("navigates to liabilities", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-liabilities")); expect(screen.getByTestId("liabilities-page")).toBeTruthy(); });
  it("navigates to history", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-history")); expect(screen.getByTestId("history-page")).toBeTruthy(); });
});
