import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Sponsor Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /sponsor tracker/i })).toBeTruthy();
  });

  it("shows 5 sponsors initially", () => {
    expect(screen.getByTestId("sponsor-count").textContent).toContain("5");
  });

  it("displays sponsor name and tier", () => {
    expect(screen.getByTestId("sponsor-name-1").textContent).toBe("TechCorp");
    expect(screen.getByTestId("sponsor-tier-1").textContent).toBe("platinum");
  });

  it("displays sponsor booth and contact", () => {
    expect(screen.getByTestId("sponsor-booth-2").textContent).toBe("B4");
    expect(screen.getByTestId("sponsor-contact-name-2").textContent).toBe("Ben Okafor");
  });

  it("contact email is a mailto link", () => {
    const link = screen.getByTestId("sponsor-contact-email-1") as HTMLAnchorElement;
    expect(link.href).toContain("mailto:");
  });

  it("adds a new sponsor", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "NewCo");
    await user.selectOptions(screen.getByTestId("input-tier"), "silver");
    await user.type(screen.getByTestId("input-booth"), "B20");
    await user.type(screen.getByTestId("input-contact-name"), "Jane Doe");
    await user.type(screen.getByTestId("input-contact-email"), "jane@newco.com");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("sponsor-count").textContent).toContain("6");
  });

  it("does not add sponsor with missing fields", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Incomplete");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("sponsor-count").textContent).toContain("5");
  });

  it("tier filter shows only gold sponsors", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("tier-filter-gold"));
    expect(screen.getByTestId("sponsor-2")).toBeTruthy();
    expect(screen.getByTestId("sponsor-4")).toBeTruthy();
    expect(screen.queryByTestId("sponsor-1")).toBeNull();
  });

  it("tier filter count updates", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("tier-filter-bronze"));
    expect(screen.getByTestId("sponsor-count").textContent).toContain("1");
  });

  it("shows No sponsors found when tier filter yields zero", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("tier-filter-platinum"));
    await user.click(screen.getByTestId("delete-btn-1"));
    expect(screen.getByTestId("no-sponsors")).toBeTruthy();
  });

  it("benefit checkbox is checked for pre-existing benefits", () => {
    const cb = screen.getByTestId("benefit-1-logo-on-website") as HTMLInputElement;
    expect(cb.checked).toBe(true);
  });

  it("toggling benefit updates state", async () => {
    const user = userEvent.setup();
    const cb = screen.getByTestId("benefit-1-swag-table") as HTMLInputElement;
    expect(cb.checked).toBe(false);
    await user.click(cb);
    expect(cb.checked).toBe(true);
  });

  it("edit button opens inline edit form", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-3"));
    expect(screen.getByTestId("edit-form-3")).toBeTruthy();
  });

  it("save updates sponsor name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-3"));
    const nameInput = screen.getByTestId("edit-name-3") as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, "DesignLab Pro");
    await user.click(screen.getByTestId("save-btn-3"));
    expect(screen.getByTestId("sponsor-name-3").textContent).toBe("DesignLab Pro");
  });

  it("cancel discards edit and restores view", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-5"));
    await user.click(screen.getByTestId("cancel-btn-5"));
    expect(screen.queryByTestId("edit-form-5")).toBeNull();
    expect(screen.getByTestId("sponsor-name-5").textContent).toBe("DataFlow");
  });

  it("delete removes sponsor from list", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-btn-5"));
    expect(screen.queryByTestId("sponsor-5")).toBeNull();
    expect(screen.getByTestId("sponsor-count").textContent).toContain("4");
  });
});
