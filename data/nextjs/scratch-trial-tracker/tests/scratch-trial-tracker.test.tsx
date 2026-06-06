import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Trial Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /trial tracker/i })).toBeTruthy();
  });

  it("shows correct summary counts from seed data", () => {
    expect(screen.getByTestId("active-trials-count").textContent).toBe("3");
    expect(screen.getByTestId("expired-trials-count").textContent).toBe("2");
    expect(screen.getByTestId("converted-trials-count").textContent).toBe("0");
  });

  it("renders all 5 seed trials", () => {
    expect(screen.getAllByTestId("trial-item").length).toBe(5);
  });

  it("each trial shows a status badge", () => {
    const badges = screen.getAllByTestId("trial-status-badge");
    expect(badges.length).toBe(5);
  });

  it("filters to active trials", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^active$/i }));
    const items = screen.getAllByTestId("trial-item");
    expect(items.length).toBe(3);
    items.forEach((item) => {
      expect(within(item).getByTestId("trial-status-badge").textContent).toBe("active");
    });
  });

  it("filters to expired trials", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^expired$/i }));
    const items = screen.getAllByTestId("trial-item");
    expect(items.length).toBe(2);
  });

  it("shows empty message when no converted trials", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^converted$/i }));
    expect(screen.getByTestId("empty-message")).toBeTruthy();
  });

  it("can mark a trial as converted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^active$/i }));
    const items = screen.getAllByTestId("trial-item");
    await user.click(within(items[0]).getByTestId("convert-btn"));
    await user.click(screen.getByRole("button", { name: /^all$/i }));
    const converted = screen.getAllByTestId("trial-status-badge").filter((b) => b.textContent === "converted");
    expect(converted.length).toBe(1);
  });

  it("summary counts update after converting a trial", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("trial-item");
    // Convert an active item (first active one: Postman)
    await user.click(within(items[1]).getByTestId("convert-btn"));
    expect(screen.getByTestId("active-trials-count").textContent).toBe("2");
    expect(screen.getByTestId("converted-trials-count").textContent).toBe("1");
  });

  it("can delete a trial", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("trial-item");
    await user.click(within(items[0]).getByTestId("delete-trial-btn"));
    expect(screen.getAllByTestId("trial-item").length).toBe(4);
  });

  it("can add a new trial", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-service"), "New Tool");
    await user.click(screen.getByRole("button", { name: /add trial/i }));
    expect(screen.getAllByTestId("trial-item").length).toBe(6);
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    const input = screen.getByTestId("input-service") as HTMLInputElement;
    await user.type(input, "Some Tool");
    await user.click(screen.getByRole("button", { name: /add trial/i }));
    expect(input.value).toBe("");
  });

  it("does not add trial with empty service name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add trial/i }));
    expect(screen.getAllByTestId("trial-item").length).toBe(5);
  });

  it("mark converted works on expired trials too", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^expired$/i }));
    const items = screen.getAllByTestId("trial-item");
    expect(items.length).toBe(2);
    await user.click(within(items[0]).getByTestId("convert-btn"));
    await user.click(screen.getByRole("button", { name: /^converted$/i }));
    expect(screen.getAllByTestId("trial-item").length).toBe(1);
  });
});
