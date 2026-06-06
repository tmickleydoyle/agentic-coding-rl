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
  it("navigates to subscriptions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-subscriptions"));
    expect(screen.getByTestId("subscriptions-page")).toBeTruthy();
  });
  it("navigates to episodes", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-episodes"));
    expect(screen.getByTestId("episodes-page")).toBeTruthy();
  });
  it("navigates to history", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("history-page")).toBeTruthy();
  });
  it("navigates back to home", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-subscriptions"));
    fireEvent.click(screen.getByTestId("nav-home"));
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });
});
