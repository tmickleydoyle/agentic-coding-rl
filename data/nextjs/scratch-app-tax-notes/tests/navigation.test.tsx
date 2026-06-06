import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => { render(<App />); expect(screen.getByTestId("navbar")).toBeTruthy(); });
  it("shows overview by default", () => { render(<App />); expect(screen.getByTestId("overview-page")).toBeTruthy(); });
  it("navigates to documents", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-documents")); expect(screen.getByTestId("documents-page")).toBeTruthy(); });
  it("navigates to deductions", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-deductions")); expect(screen.getByTestId("deductions-page")).toBeTruthy(); });
  it("navigates to notes", () => { render(<App />); fireEvent.click(screen.getByTestId("nav-notes")); expect(screen.getByTestId("notes-page")).toBeTruthy(); });
});
