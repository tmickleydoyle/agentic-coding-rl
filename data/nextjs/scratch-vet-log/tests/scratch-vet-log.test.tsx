import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Vet Visit Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the main heading", () => {
    expect(screen.getByRole("heading", { name: /vet visit log/i })).toBeTruthy();
  });

  it("shows two pet buttons", () => {
    expect(screen.getByTestId("pet-btn-bella")).toBeTruthy();
    expect(screen.getByTestId("pet-btn-mittens")).toBeTruthy();
  });

  it("shows Bella as default with species Dog", () => {
    expect(screen.getByTestId("pet-name").textContent).toBe("Bella");
    expect(screen.getByTestId("pet-species").textContent).toBe("Dog");
  });

  it("renders visit rows for Bella", () => {
    expect(screen.getByTestId("visit-row-0")).toBeTruthy();
    expect(screen.getByTestId("visit-row-1")).toBeTruthy();
  });

  it("shows next appointment banner for Bella (2025-01-15 is future of 2024-07-01)", () => {
    expect(screen.getByTestId("next-appt-banner").textContent).toContain("2025-01-15");
  });

  it("switches to Mittens and shows her data", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("pet-btn-mittens"));
    expect(screen.getByTestId("pet-name").textContent).toBe("Mittens");
    expect(screen.getByTestId("pet-species").textContent).toBe("Cat");
    expect(screen.getByTestId("visit-row-0")).toBeTruthy();
  });

  it("Mittens has only one visit row", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("pet-btn-mittens"));
    expect(screen.queryByTestId("visit-row-1")).toBeNull();
  });

  it("adds a new visit to Bella", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("visit-date-input"), "2024-08-01");
    await user.type(screen.getByTestId("visit-vet-input"), "Dr. Brown");
    await user.type(screen.getByTestId("visit-diagnosis-input"), "Checkup");
    await user.click(screen.getByRole("button", { name: /add visit/i }));
    expect(screen.getByTestId("visit-row-2")).toBeTruthy();
  });

  it("does not add visit when vet name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("visit-date-input"), "2024-08-01");
    await user.click(screen.getByRole("button", { name: /add visit/i }));
    expect(screen.queryByTestId("visit-row-2")).toBeNull();
  });

  it("clears form after adding visit", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("visit-vet-input"), "Dr. Test");
    await user.type(screen.getByTestId("visit-date-input"), "2024-08-01");
    await user.click(screen.getByRole("button", { name: /add visit/i }));
    const vetInput = screen.getByTestId("visit-vet-input") as HTMLInputElement;
    expect(vetInput.value).toBe("");
  });

  it("deletes a visit", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-visit-0"));
    expect(screen.queryByTestId("visit-row-1")).toBeNull();
  });

  it("shows no-visits-msg when all visits deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-visit-1"));
    await user.click(screen.getByTestId("delete-visit-0"));
    expect(screen.getByTestId("no-visits-msg")).toBeTruthy();
  });

  it("visits are independent between pets", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-visit-0"));
    await user.click(screen.getByTestId("pet-btn-mittens"));
    expect(screen.getByTestId("visit-row-0")).toBeTruthy();
  });
});
