import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Camera Settings", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /camera settings/i })).toBeTruthy();
  });

  it("shows 3 presets on load", () => {
    expect(screen.getByTestId("preset-count").textContent).toContain("3");
  });

  it("renders all seed presets", () => {
    expect(screen.getByTestId("preset-1")).toBeTruthy();
    expect(screen.getByTestId("preset-2")).toBeTruthy();
    expect(screen.getByTestId("preset-3")).toBeTruthy();
  });

  it("displays aperture for seed preset", () => {
    expect(screen.getByTestId("preset-aperture-1").textContent).toBe("f/1.8");
  });

  it("displays mode for seed preset", () => {
    expect(screen.getByTestId("preset-mode-2").textContent).toBe("Manual");
  });

  it("detail panel is hidden on load", () => {
    expect(screen.queryByTestId("detail-panel")).toBeNull();
  });

  it("clicking a preset shows detail panel", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("preset-1"));
    expect(screen.getByTestId("detail-panel")).toBeTruthy();
    expect(screen.getByTestId("detail-name").textContent).toBe("Portrait Sunny");
  });

  it("clicking same preset again hides detail panel", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("preset-1"));
    await user.click(screen.getByTestId("preset-1"));
    expect(screen.queryByTestId("detail-panel")).toBeNull();
  });

  it("adds a new preset", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Action Sports");
    await user.type(screen.getByTestId("input-aperture"), "f/4");
    await user.type(screen.getByTestId("input-shutter"), "1/1000s");
    await user.clear(screen.getByTestId("input-iso"));
    await user.type(screen.getByTestId("input-iso"), "800");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("preset-count").textContent).toContain("4");
    expect(screen.getByText("Action Sports")).toBeTruthy();
  });

  it("does not submit with ISO of 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Bad ISO");
    await user.type(screen.getByTestId("input-aperture"), "f/4");
    await user.type(screen.getByTestId("input-shutter"), "1/100s");
    await user.clear(screen.getByTestId("input-iso"));
    await user.type(screen.getByTestId("input-iso"), "0");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("preset-count").textContent).toContain("3");
  });

  it("deletes a preset", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-2"));
    expect(screen.queryByTestId("preset-2")).toBeNull();
    expect(screen.getByTestId("preset-count").textContent).toContain("2");
  });

  it("deleting selected preset hides detail panel", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("preset-1"));
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("detail-panel")).toBeNull();
  });

  it("detail panel shows ISO", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("preset-2"));
    expect(screen.getByTestId("detail-iso").textContent).toContain("3200");
  });
});
