import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows portfolio by default", () => { render(<App />); expect(screen.getByTestId("portfolio-page")).toBeTruthy(); });
  it("navigates to holdings", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-holdings")); expect(screen.getByTestId("holdings-page")).toBeTruthy(); });
  it("navigates to transactions", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-transactions")); expect(screen.getByTestId("transactions-page")).toBeTruthy(); });
  it("navigates to performance", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-performance")); expect(screen.getByTestId("performance-page")).toBeTruthy(); });
});
