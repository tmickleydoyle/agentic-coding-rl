import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Livestock Catalog", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: "Livestock Catalog" })).toBeTruthy();
  });

  it("shows 5 seed entries on load", () => {
    expect(screen.getByTestId("total-animals").textContent).toBe("5");
  });

  it("shows correct initial total quantity", () => {
    expect(screen.getByTestId("total-quantity").textContent).toBe("33");
  });

  it("renders seed animal names", () => {
    expect(screen.getByTestId("animal-name-1").textContent).toBe("Nemo");
    expect(screen.getByTestId("animal-name-4").textContent).toBe("Neon Tetra");
  });

  it("renders seed animal species", () => {
    expect(screen.getByTestId("animal-species-1").textContent).toBe("Amphiprioninae");
  });

  it("renders seed animal tank", () => {
    expect(screen.getByTestId("animal-tank-1").textContent).toBe("Reef Tank");
    expect(screen.getByTestId("animal-tank-4").textContent).toBe("Freshwater");
  });

  it("renders seed animal quantity", () => {
    expect(screen.getByTestId("animal-quantity-4").textContent).toBe("10");
    expect(screen.getByTestId("animal-quantity-5").textContent).toBe("15");
  });

  it("renders animal type", () => {
    expect(screen.getByTestId("animal-type-1").textContent).toBe("Fish");
    expect(screen.getByTestId("animal-type-3").textContent).toBe("Invertebrate");
  });

  it("adds a new animal", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("name-input"), "Mandarin Dragonet");
    await user.type(screen.getByTestId("species-input"), "Synchiropus splendidus");
    await user.type(screen.getByTestId("quantity-input"), "1");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("total-animals").textContent).toBe("6");
  });

  it("clears name species quantity after add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("name-input"), "Goby");
    await user.type(screen.getByTestId("species-input"), "Amblyeleotris sp.");
    await user.type(screen.getByTestId("quantity-input"), "2");
    await user.click(screen.getByTestId("add-button"));
    expect((screen.getByTestId("name-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("species-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("quantity-input") as HTMLInputElement).value).toBe("");
  });

  it("does not add animal with empty name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("species-input"), "Species sp.");
    await user.type(screen.getByTestId("quantity-input"), "1");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("total-animals").textContent).toBe("5");
  });

  it("does not add animal with quantity 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("name-input"), "Ghost");
    await user.type(screen.getByTestId("species-input"), "Ghost sp.");
    await user.type(screen.getByTestId("quantity-input"), "0");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("total-animals").textContent).toBe("5");
  });

  it("deletes an animal", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("animal-1")).toBeNull();
    expect(screen.getByTestId("total-animals").textContent).toBe("4");
  });

  it("deleting updates total quantity", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-4"));
    expect(screen.getByTestId("total-quantity").textContent).toBe("23");
  });

  it("searches by name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "nemo");
    expect(screen.getByTestId("total-animals").textContent).toBe("1");
    expect(screen.getByTestId("animal-name-1").textContent).toBe("Nemo");
  });

  it("searches by species (case-insensitive)", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "paracheirodon");
    expect(screen.getByTestId("total-animals").textContent).toBe("1");
  });

  it("filters by tank", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("tank-filter"), "Freshwater");
    expect(screen.getByTestId("total-animals").textContent).toBe("2");
  });

  it("search and tank filter combine", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("tank-filter"), "Reef Tank");
    await user.type(screen.getByTestId("search-input"), "snail");
    expect(screen.getByTestId("total-animals").textContent).toBe("1");
  });

  it("tank filter dropdown contains All and all 4 tanks", () => {
    const select = screen.getByTestId("tank-filter") as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toContain("All");
    expect(options).toContain("Reef Tank");
    expect(options).toContain("Freshwater");
    expect(options).toContain("Quarantine");
    expect(options).toContain("Planted");
  });
});
