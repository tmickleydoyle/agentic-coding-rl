import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Navigation", () => {
  it("renders dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("recipe-count")).toBeTruthy();
  });

  it("shows nav buttons", () => {
    render(<App />);
    expect(screen.getByTestId("nav-dashboard")).toBeTruthy();
    expect(screen.getByTestId("nav-add-recipe")).toBeTruthy();
  });

  it("navigates to add-recipe on click", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-recipe"));
    expect(screen.getByTestId("add-recipe-form")).toBeTruthy();
  });

  it("navigates back to dashboard from add-recipe", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-recipe"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    expect(screen.getByTestId("recipe-count")).toBeTruthy();
  });
});
