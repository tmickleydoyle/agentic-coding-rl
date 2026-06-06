import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Aquarium Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: "Aquarium Log" })).toBeTruthy();
  });

  it("renders 4 seed observations on load", () => {
    const list = screen.getByTestId("observations-list");
    expect(within(list).getAllByRole("listitem").length).toBe(4);
  });

  it("shows obs-count of 4 initially", () => {
    expect(screen.getByTestId("obs-count").textContent).toContain("4");
  });

  it("renders seed observation tank names", () => {
    expect(screen.getByTestId("obs-tank-1").textContent).toBe("Reef Tank");
    expect(screen.getByTestId("obs-tank-2").textContent).toBe("Freshwater");
  });

  it("renders seed observation notes", () => {
    expect(screen.getByTestId("obs-note-1").textContent).toContain("Clownfish");
    expect(screen.getByTestId("obs-note-2").textContent).toContain("algae");
  });

  it("renders seed observation dates", () => {
    expect(screen.getByTestId("obs-date-1").textContent).toBe("2024-01-10");
  });

  it("adds a new observation", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("tank-select"), "Freshwater");
    await user.clear(screen.getByTestId("note-input"));
    await user.type(screen.getByTestId("note-input"), "New observation note");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("obs-count").textContent).toContain("5");
  });

  it("clears note input after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("note-input"), "Some note");
    await user.click(screen.getByTestId("add-button"));
    expect((screen.getByTestId("note-input") as HTMLTextAreaElement).value).toBe("");
  });

  it("does not add observation with empty note", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("obs-count").textContent).toContain("4");
  });

  it("does not add observation with whitespace-only note", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("note-input"), "   ");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("obs-count").textContent).toContain("4");
  });

  it("deletes an observation", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("observation-1")).toBeNull();
    expect(screen.getByTestId("obs-count").textContent).toContain("3");
  });

  it("filters observations by tank", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-select"), "Reef Tank");
    const list = screen.getByTestId("observations-list");
    const items = within(list).getAllByRole("listitem");
    expect(items.length).toBe(2);
    expect(screen.getByTestId("obs-count").textContent).toContain("2");
  });

  it("filter All shows all observations", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-select"), "Reef Tank");
    await user.selectOptions(screen.getByTestId("filter-select"), "All");
    expect(screen.getByTestId("obs-count").textContent).toContain("4");
  });

  it("filter dropdown contains all 4 tanks plus All", () => {
    const select = screen.getByTestId("filter-select") as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toContain("All");
    expect(options).toContain("Reef Tank");
    expect(options).toContain("Freshwater");
    expect(options).toContain("Quarantine");
    expect(options).toContain("Planted");
  });

  it("deleting while filtered only removes that entry", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-select"), "Reef Tank");
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.getByTestId("obs-count").textContent).toContain("1");
    expect(screen.queryByTestId("observation-1")).toBeNull();
    expect(screen.getByTestId("observation-3")).toBeTruthy();
  });
});
