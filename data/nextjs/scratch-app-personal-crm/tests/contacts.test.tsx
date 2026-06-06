import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Dashboard", () => {
  it("shows contact count", () => {
    render(<App />);
    expect(screen.getByTestId("contact-count").textContent).toBe("3");
  });

  it("shows recent contacts", () => {
    render(<App />);
    const items = screen.getAllByTestId("recent-contact-item");
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it("quick-add adds a contact and updates count", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("quick-name"), { target: { value: "Dave New" } });
    fireEvent.change(screen.getByTestId("quick-company"), { target: { value: "NewCo" } });
    fireEvent.change(screen.getByTestId("quick-email"), { target: { value: "dave@newco.com" } });
    fireEvent.click(screen.getByTestId("quick-add-btn"));
    expect(screen.getByTestId("contact-count").textContent).toBe("4");
  });
});

describe("Contacts page", () => {
  it("shows all contacts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contacts"));
    const rows = screen.getAllByTestId("contact-row");
    expect(rows.length).toBe(3);
  });

  it("filters contacts by name search", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contacts"));
    fireEvent.change(screen.getByTestId("search-input"), { target: { value: "Alice" } });
    const rows = screen.getAllByTestId("contact-row");
    expect(rows.length).toBe(1);
  });

  it("shows no-results when search has no matches", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contacts"));
    fireEvent.change(screen.getByTestId("search-input"), { target: { value: "zzznomatch" } });
    expect(screen.getByTestId("no-results")).toBeTruthy();
  });

  it("deletes a contact", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contacts"));
    const deleteButtons = screen.getAllByTestId("delete-contact");
    fireEvent.click(deleteButtons[0]);
    const rows = screen.getAllByTestId("contact-row");
    expect(rows.length).toBe(2);
  });
});
