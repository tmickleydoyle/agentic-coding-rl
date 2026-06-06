import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });
  it("navigates to items", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-items"));
    expect(screen.getByTestId("items-page")).toBeTruthy();
  });
  it("navigates to categories", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-categories"));
    expect(screen.getByTestId("categories-page")).toBeTruthy();
  });
  it("navigates to shared", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-shared"));
    expect(screen.getByTestId("shared-page")).toBeTruthy();
  });
  it("navigates back to home", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-items"));
    fireEvent.click(screen.getByTestId("nav-home"));
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });
});
