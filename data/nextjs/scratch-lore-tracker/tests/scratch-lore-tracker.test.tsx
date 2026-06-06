import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Lore Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: "Lore Tracker" })).toBeTruthy();
  });

  it("shows correct initial stats", () => {
    expect(screen.getByTestId("total-entries").textContent).toBe("4");
    expect(screen.getByTestId("favorites-count").textContent).toBe("2");
  });

  it("renders all seed entry cards", () => {
    expect(screen.getByTestId("entry-card-1")).toBeTruthy();
    expect(screen.getByTestId("entry-card-4")).toBeTruthy();
  });

  it("shows correct seed entry data", () => {
    expect(screen.getByTestId("entry-name-1").textContent).toBe("The Sunstone");
    expect(screen.getByTestId("entry-type-2").textContent).toBe("Location");
    expect(screen.getByTestId("entry-description-3").textContent).toBe("A fallen paladin who turned to dark magic");
    expect(screen.getByTestId("entry-favorite-1").textContent).toBe("Favorite");
    expect(screen.getByTestId("entry-favorite-2").textContent).toBe("Not Favorite");
  });

  it("shows correct favorite toggle button text", () => {
    expect(screen.getByTestId("favorite-toggle-1").textContent).toBe("Remove Favorite");
    expect(screen.getByTestId("favorite-toggle-2").textContent).toBe("Add Favorite");
  });

  it("toggles favorite status", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("favorite-toggle-2"));
    expect(screen.getByTestId("entry-favorite-2").textContent).toBe("Favorite");
    expect(screen.getByTestId("favorites-count").textContent).toBe("3");
  });

  it("removes from favorites", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("favorite-toggle-1"));
    expect(screen.getByTestId("entry-favorite-1").textContent).toBe("Not Favorite");
    expect(screen.getByTestId("favorites-count").textContent).toBe("1");
  });

  it("filters by type", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("type-filter"), "Artifact");
    expect(screen.getByTestId("entry-card-1")).toBeTruthy();
    expect(screen.queryByTestId("entry-card-2")).toBeNull();
  });

  it("type filter All shows everything", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("type-filter"), "Character");
    await user.selectOptions(screen.getByTestId("type-filter"), "All");
    expect(screen.getByTestId("entry-card-1")).toBeTruthy();
    expect(screen.getByTestId("entry-card-2")).toBeTruthy();
  });

  it("shows only favorites when filter active", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("favorites-filter-btn"));
    expect(screen.getByTestId("entry-card-1")).toBeTruthy();
    expect(screen.getByTestId("entry-card-3")).toBeTruthy();
    expect(screen.queryByTestId("entry-card-2")).toBeNull();
    expect(screen.queryByTestId("entry-card-4")).toBeNull();
  });

  it("favorites filter button text changes", async () => {
    expect(screen.getByTestId("favorites-filter-btn").textContent).toBe("Show Favorites Only");
    const user = userEvent.setup();
    await user.click(screen.getByTestId("favorites-filter-btn"));
    expect(screen.getByTestId("favorites-filter-btn").textContent).toBe("Show All");
  });

  it("combined type and favorites filter uses AND logic", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("favorites-filter-btn"));
    await user.selectOptions(screen.getByTestId("type-filter"), "Location");
    expect(screen.queryByTestId("entry-card-1")).toBeNull();
    expect(screen.queryByTestId("entry-card-2")).toBeNull();
  });

  it("deletes an entry and updates stats", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-entry-1"));
    expect(screen.queryByTestId("entry-card-1")).toBeNull();
    expect(screen.getByTestId("total-entries").textContent).toBe("3");
    expect(screen.getByTestId("favorites-count").textContent).toBe("1");
  });

  it("adds a new entry", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("entry-name-input"), "The Shadow Realm");
    await user.selectOptions(screen.getByTestId("entry-type-input"), "Location");
    await user.type(screen.getByTestId("entry-description-input"), "A dimension of pure darkness");
    await user.click(screen.getByTestId("add-entry-btn"));
    expect(screen.getByTestId("total-entries").textContent).toBe("5");
  });

  it("does not add entry with empty name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("entry-description-input"), "Some description");
    await user.click(screen.getByTestId("add-entry-btn"));
    expect(screen.getByTestId("total-entries").textContent).toBe("4");
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("entry-name-input"), "New Entry");
    await user.type(screen.getByTestId("entry-description-input"), "A description");
    await user.click(screen.getByTestId("add-entry-btn"));
    expect((screen.getByTestId("entry-name-input") as HTMLInputElement).value).toBe("");
  });
});
