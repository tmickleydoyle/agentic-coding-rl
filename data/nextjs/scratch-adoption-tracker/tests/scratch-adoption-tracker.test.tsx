import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Pet Adoption Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the main heading", () => {
    expect(screen.getByRole("heading", { name: /pet adoption tracker/i })).toBeTruthy();
  });

  it("shows correct initial status counts", () => {
    expect(screen.getByTestId("count-available").textContent).toContain("2");
    expect(screen.getByTestId("count-pending").textContent).toContain("1");
    expect(screen.getByTestId("count-adopted").textContent).toContain("1");
  });

  it("renders all 4 pets initially", () => {
    expect(screen.getByTestId("pet-card-1")).toBeTruthy();
    expect(screen.getByTestId("pet-card-2")).toBeTruthy();
    expect(screen.getByTestId("pet-card-3")).toBeTruthy();
    expect(screen.getByTestId("pet-card-4")).toBeTruthy();
  });

  it("shows correct names for seed pets", () => {
    expect(screen.getByTestId("pet-card-name-1").textContent).toBe("Daisy");
    expect(screen.getByTestId("pet-card-name-2").textContent).toBe("Oliver");
  });

  it("shows correct statuses for seed pets", () => {
    expect(screen.getByTestId("pet-status-1").textContent).toBe("Available");
    expect(screen.getByTestId("pet-status-2").textContent).toBe("Pending");
    expect(screen.getByTestId("pet-status-3").textContent).toBe("Adopted");
  });

  it("filters to Available pets", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-available"));
    expect(screen.getByTestId("pet-card-1")).toBeTruthy();
    expect(screen.queryByTestId("pet-card-2")).toBeNull();
    expect(screen.queryByTestId("pet-card-3")).toBeNull();
  });

  it("filters to Pending pets", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-pending"));
    expect(screen.getByTestId("pet-card-2")).toBeTruthy();
    expect(screen.queryByTestId("pet-card-1")).toBeNull();
  });

  it("shows no-pets-msg when filter has no results", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-adopted"));
    await user.click(screen.getByTestId("pet-card-3"));
    await user.click(screen.getByTestId("edit-status-select"));
    await userEvent.selectOptions(screen.getByTestId("edit-status-select"), "Available");
    await user.click(screen.getByTestId("save-changes-btn"));
    await user.click(screen.getByTestId("filter-adopted"));
    expect(screen.getByTestId("no-pets-msg")).toBeTruthy();
  });

  it("opens edit panel when pet card is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("pet-card-1"));
    expect(screen.getByTestId("edit-panel")).toBeTruthy();
  });

  it("saves status change", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("pet-card-1"));
    await userEvent.selectOptions(screen.getByTestId("edit-status-select"), "Pending");
    await user.type(screen.getByTestId("edit-applicant-input"), "Alice");
    await user.click(screen.getByTestId("save-changes-btn"));
    expect(screen.getByTestId("pet-status-1").textContent).toBe("Pending");
  });

  it("cancel closes edit panel without saving", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("pet-card-2"));
    await user.click(screen.getByTestId("cancel-edit-btn"));
    expect(screen.queryByTestId("edit-panel")).toBeNull();
    expect(screen.getByTestId("pet-status-2").textContent).toBe("Pending");
  });

  it("adds a new pet", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("add-name-input"), "Fluffy");
    await user.type(screen.getByTestId("add-species-input"), "Cat");
    await user.type(screen.getByTestId("add-breed-input"), "Persian");
    await user.type(screen.getByTestId("add-age-input"), "2");
    await user.click(screen.getByRole("button", { name: /add pet/i }));
    expect(screen.getByTestId("pet-card-5")).toBeTruthy();
  });

  it("new pet has Available status", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("add-name-input"), "Fluffy");
    await user.type(screen.getByTestId("add-species-input"), "Cat");
    await user.click(screen.getByRole("button", { name: /add pet/i }));
    expect(screen.getByTestId("pet-status-5").textContent).toBe("Available");
  });

  it("does not add pet when name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("add-species-input"), "Cat");
    await user.click(screen.getByRole("button", { name: /add pet/i }));
    expect(screen.queryByTestId("pet-card-5")).toBeNull();
  });

  it("status counts update after editing a pet", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("pet-card-1"));
    await userEvent.selectOptions(screen.getByTestId("edit-status-select"), "Adopted");
    await user.click(screen.getByTestId("save-changes-btn"));
    expect(screen.getByTestId("count-available").textContent).toContain("1");
    expect(screen.getByTestId("count-adopted").textContent).toContain("2");
  });
});
