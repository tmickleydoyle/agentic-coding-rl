import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

describe("Inventory Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed items", () => {
    render(<App />);
    expect(screen.getByTestId("item-row-item1")).toBeTruthy();
    expect(screen.getByTestId("item-row-item2")).toBeTruthy();
  });

  it("shows item quantity", () => {
    render(<App />);
    expect(screen.getByTestId("item-quantity-item1").textContent).toBe("150");
  });

  it("increments quantity", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("item-inc-item1"));
    expect(screen.getByTestId("item-quantity-item1").textContent).toBe("151");
  });

  it("decrements quantity", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("item-dec-item1"));
    expect(screen.getByTestId("item-quantity-item1").textContent).toBe("149");
  });

  it("adds new item", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("item-name"), { target: { value: "Pasta" } });
    fireEvent.click(screen.getByTestId("item-submit"));
    expect(screen.getByText("Pasta")).toBeTruthy();
  });
});

describe("Donations Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed donations", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-donations"));
    expect(screen.getByTestId("donation-row-don1")).toBeTruthy();
    expect(screen.getByTestId("donation-row-don2")).toBeTruthy();
  });

  it("marks donation as received", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-donations"));
    fireEvent.click(screen.getByTestId("mark-received-don2"));
    expect(screen.getByTestId("donation-status-don2").textContent).toBe("Received");
  });
});

describe("Clients Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed clients", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-clients"));
    expect(screen.getByTestId("client-row-cli1")).toBeTruthy();
  });

  it("adds a client", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-clients"));
    fireEvent.change(screen.getByTestId("client-name"), { target: { value: "Brown Family" } });
    fireEvent.click(screen.getByTestId("client-submit"));
    expect(screen.getByText("Brown Family")).toBeTruthy();
  });
});
