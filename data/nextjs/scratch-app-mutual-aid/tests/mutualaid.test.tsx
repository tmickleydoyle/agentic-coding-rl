import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

describe("Requests Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed requests", () => {
    render(<App />);
    expect(screen.getByTestId("request-row-req1")).toBeTruthy();
    expect(screen.getByTestId("request-row-req2")).toBeTruthy();
  });

  it("shows request status", () => {
    render(<App />);
    expect(screen.getByTestId("request-status-req1").textContent).toBe("Open");
    expect(screen.getByTestId("request-status-req3").textContent).toBe("Fulfilled");
  });

  it("adds new request", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("request-title"), { target: { value: "Need warm clothes" } });
    fireEvent.change(screen.getByTestId("request-requester"), { target: { value: "George" } });
    fireEvent.click(screen.getByTestId("request-submit"));
    expect(screen.getByText("Need warm clothes")).toBeTruthy();
  });

  it("fulfills a request", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("fulfill-req1"));
    expect(screen.getByTestId("request-status-req1").textContent).toBe("Fulfilled");
  });
});

describe("Offers Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed offers", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-offers"));
    expect(screen.getByTestId("offer-row-off1")).toBeTruthy();
  });

  it("toggles availability", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-offers"));
    fireEvent.click(screen.getByTestId("toggle-available-off1"));
    expect(screen.getByTestId("offer-available-off1").textContent).toBe("Unavailable");
  });
});

describe("Matches Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed match", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-matches"));
    expect(screen.getByTestId("match-row-m1")).toBeTruthy();
  });

  it("creates a new match", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-matches"));
    fireEvent.change(screen.getByTestId("match-request"), { target: { value: "req1" } });
    fireEvent.change(screen.getByTestId("match-offer"), { target: { value: "off1" } });
    fireEvent.change(screen.getByTestId("match-by"), { target: { value: "Coordinator" } });
    fireEvent.click(screen.getByTestId("match-submit"));
    expect(screen.getByTestId("match-row-m2")).toBeTruthy();
  });
});
