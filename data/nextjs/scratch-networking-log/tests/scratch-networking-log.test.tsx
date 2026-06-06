import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Networking Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /networking log/i })).toBeTruthy();
  });

  it("shows 5 seed contacts initially", () => {
    expect(screen.getByTestId("contact-count").textContent).toContain("5");
  });

  it("displays contact name and company", () => {
    expect(screen.getByTestId("contact-name-1").textContent).toBe("Alice Tran");
    expect(screen.getByTestId("contact-company-1").textContent).toBe("TechCorp");
  });

  it("displays contact follow-up status", () => {
    expect(screen.getByTestId("contact-followup-2").textContent).toBe("done");
  });

  it("adds a new contact", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "New Person");
    await user.type(screen.getByTestId("input-company"), "NewCo");
    await user.type(screen.getByTestId("input-role"), "Dev");
    await user.type(screen.getByTestId("input-email"), "new@newco.com");
    await user.type(screen.getByTestId("input-metat"), "Day 2");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("contact-count").textContent).toContain("6");
  });

  it("does not add contact with missing required field", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Incomplete");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("contact-count").textContent).toContain("5");
  });

  it("marks a contact as done", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("mark-done-btn-1"));
    expect(screen.getByTestId("contact-followup-1").textContent).toBe("done");
  });

  it("skip sets status to skipped", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("skip-btn-1"));
    expect(screen.getByTestId("contact-followup-1").textContent).toBe("skipped");
  });

  it("reset button appears for done contacts and resets to pending", async () => {
    const user = userEvent.setup();
    expect(screen.getByTestId("reset-btn-2")).toBeTruthy();
    await user.click(screen.getByTestId("reset-btn-2"));
    expect(screen.getByTestId("contact-followup-2").textContent).toBe("pending");
  });

  it("status filter Done shows only done contacts", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("status-filter-done"));
    expect(screen.getByTestId("contact-2")).toBeTruthy();
    expect(screen.queryByTestId("contact-1")).toBeNull();
  });

  it("status filter Pending shows pending and skipped", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("status-filter-pending"));
    expect(screen.getByTestId("contact-1")).toBeTruthy();
    expect(screen.getByTestId("contact-4")).toBeTruthy();
    expect(screen.queryByTestId("contact-2")).toBeNull();
  });

  it("search filters by name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "Alice");
    expect(screen.getByTestId("contact-1")).toBeTruthy();
    expect(screen.queryByTestId("contact-2")).toBeNull();
  });

  it("search and status filter combine", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "a");
    await user.click(screen.getByTestId("status-filter-done"));
    expect(screen.queryByTestId("contact-1")).toBeNull();
  });

  it("shows No contacts found when filters yield zero results", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "ZZZZNONEXISTENT");
    expect(screen.getByTestId("no-contacts")).toBeTruthy();
  });

  it("email is rendered as a mailto link", () => {
    const link = screen.getByTestId("contact-email-3") as HTMLAnchorElement;
    expect(link.href).toContain("mailto:");
  });
});
