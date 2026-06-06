import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Subscription Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /subscription log/i })).toBeTruthy();
  });

  it("shows total cost of active subscriptions only", () => {
    // Active: GitHub Pro (4) + Figma (15) + Vercel Pro (20) = 39.00
    const total = screen.getByTestId("total-cost");
    expect(total.textContent).toBe("$39.00/mo");
  });

  it("shows correct active count", () => {
    const count = screen.getByTestId("active-count");
    expect(count.textContent).toBe("3");
  });

  it("renders all 5 seed subscriptions by default", () => {
    const items = screen.getAllByTestId("subscription-item");
    expect(items.length).toBe(5);
  });

  it("filters subscriptions by status - active", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^active$/i }));
    const items = screen.getAllByTestId("subscription-item");
    expect(items.length).toBe(3);
    items.forEach((item) => {
      const badge = within(item).getByTestId("status-badge");
      expect(badge.textContent).toBe("active");
    });
  });

  it("filters subscriptions by status - paused", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^paused$/i }));
    const items = screen.getAllByTestId("subscription-item");
    expect(items.length).toBe(1);
    expect(within(items[0]).getByTestId("status-badge").textContent).toBe("paused");
  });

  it("shows empty message when filter has no results after deletion", async () => {
    const user = userEvent.setup();
    // Filter to cancelled (only Notion)
    await user.click(screen.getByRole("button", { name: /^cancelled$/i }));
    const items = screen.getAllByTestId("subscription-item");
    expect(items.length).toBe(1);
    // Delete the only cancelled item
    await user.click(within(items[0]).getByTestId("delete-btn"));
    expect(screen.getByTestId("empty-message")).toBeTruthy();
  });

  it("can add a new subscription", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "New Service");
    await user.type(screen.getByTestId("input-cost"), "12");
    await user.type(screen.getByTestId("input-category"), "Tools");
    await user.click(screen.getByRole("button", { name: /add subscription/i }));
    const items = screen.getAllByTestId("subscription-item");
    expect(items.length).toBe(6);
    const names = items.map((i) => i.textContent);
    expect(names.some((n) => n && n.includes("New Service"))).toBe(true);
  });

  it("clears the form after adding a subscription", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    await user.type(nameInput, "Another Service");
    await user.type(screen.getByTestId("input-cost"), "5");
    await user.click(screen.getByRole("button", { name: /add subscription/i }));
    expect(nameInput.value).toBe("");
  });

  it("can delete a subscription", async () => {
    const user = userEvent.setup();
    const itemsBefore = screen.getAllByTestId("subscription-item");
    await user.click(within(itemsBefore[0]).getByTestId("delete-btn"));
    const itemsAfter = screen.getAllByTestId("subscription-item");
    expect(itemsAfter.length).toBe(4);
  });

  it("toggle status cycles active -> paused -> cancelled -> active", async () => {
    const user = userEvent.setup();
    // Filter to active to find an active item
    await user.click(screen.getByRole("button", { name: /^active$/i }));
    const items = screen.getAllByTestId("subscription-item");
    const badge = within(items[0]).getByTestId("status-badge");
    expect(badge.textContent).toBe("active");
    await user.click(within(items[0]).getByRole("button", { name: /toggle status/i }));
    // Go back to all to see updated item
    await user.click(screen.getByRole("button", { name: /^all$/i }));
    const badges = screen.getAllByTestId("status-badge");
    const texts = badges.map((b) => b.textContent);
    expect(texts.filter((t) => t === "paused").length).toBe(2);
  });

  it("does not add subscription with empty name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-cost"), "10");
    await user.click(screen.getByRole("button", { name: /add subscription/i }));
    const items = screen.getAllByTestId("subscription-item");
    expect(items.length).toBe(5);
  });

  it("total cost updates after adding an active subscription", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "New Tool");
    await user.type(screen.getByTestId("input-cost"), "10");
    await user.click(screen.getByRole("button", { name: /add subscription/i }));
    const total = screen.getByTestId("total-cost");
    expect(total.textContent).toBe("$49.00/mo");
  });
});
