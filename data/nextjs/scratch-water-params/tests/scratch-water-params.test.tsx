import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Water Parameter Recorder", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: "Water Parameters" })).toBeTruthy();
  });

  it("shows 3 seed readings on load", () => {
    expect(screen.getByTestId("reading-count").textContent).toContain("3");
  });

  it("renders seed reading tank names", () => {
    expect(screen.getByTestId("reading-tank-1").textContent).toBe("Reef Tank");
    expect(screen.getByTestId("reading-tank-2").textContent).toBe("Freshwater");
  });

  it("renders seed reading values", () => {
    expect(screen.getByTestId("reading-ph-1").textContent).toBe("8.2");
    expect(screen.getByTestId("reading-ammonia-2").textContent).toBe("0.25");
  });

  it("renders seed reading dates", () => {
    expect(screen.getByTestId("reading-date-1").textContent).toBe("2024-01-10");
  });

  it("shows safe status for reading 1", () => {
    expect(screen.getByTestId("reading-status-1").textContent).toBe("safe");
  });

  it("shows safe status for reading 2 (ammonia at boundary 0.25)", () => {
    expect(screen.getByTestId("reading-status-2").textContent).toBe("safe");
  });

  it("shows safe status for reading 3", () => {
    expect(screen.getByTestId("reading-status-3").textContent).toBe("safe");
  });

  it("adds a new reading with warning status", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("tank-select"), "Quarantine");
    await user.type(screen.getByTestId("ph-input"), "6.0");
    await user.type(screen.getByTestId("ammonia-input"), "0.5");
    await user.type(screen.getByTestId("nitrite-input"), "0.0");
    await user.type(screen.getByTestId("nitrate-input"), "10");
    await user.click(screen.getByTestId("record-button"));
    expect(screen.getByTestId("reading-count").textContent).toContain("4");
    expect(screen.getByTestId("reading-status-4").textContent).toBe("warning");
  });

  it("adds a reading with safe status", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("ph-input"), "7.5");
    await user.type(screen.getByTestId("ammonia-input"), "0.0");
    await user.type(screen.getByTestId("nitrite-input"), "0.0");
    await user.type(screen.getByTestId("nitrate-input"), "5");
    await user.click(screen.getByTestId("record-button"));
    expect(screen.getByTestId("reading-status-4").textContent).toBe("safe");
  });

  it("does not add reading with empty ph", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("ammonia-input"), "0.0");
    await user.type(screen.getByTestId("nitrite-input"), "0.0");
    await user.type(screen.getByTestId("nitrate-input"), "5");
    await user.click(screen.getByTestId("record-button"));
    expect(screen.getByTestId("reading-count").textContent).toContain("3");
  });

  it("clears numeric inputs after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("ph-input"), "7.5");
    await user.type(screen.getByTestId("ammonia-input"), "0.0");
    await user.type(screen.getByTestId("nitrite-input"), "0.0");
    await user.type(screen.getByTestId("nitrate-input"), "5");
    await user.click(screen.getByTestId("record-button"));
    expect((screen.getByTestId("ph-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("ammonia-input") as HTMLInputElement).value).toBe("");
  });

  it("deletes a reading", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("reading-1")).toBeNull();
    expect(screen.getByTestId("reading-count").textContent).toContain("2");
  });

  it("filters by tank", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-select"), "Reef Tank");
    expect(screen.getByTestId("reading-count").textContent).toContain("2");
    const list = screen.getByTestId("readings-list");
    expect(within(list).getAllByRole("listitem").length).toBe(2);
  });

  it("filter select contains All and all 4 tanks", () => {
    const select = screen.getByTestId("filter-select") as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).toContain("All");
    expect(options).toContain("Reef Tank");
    expect(options).toContain("Freshwater");
    expect(options).toContain("Quarantine");
    expect(options).toContain("Planted");
  });
});
