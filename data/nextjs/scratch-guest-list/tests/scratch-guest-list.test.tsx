import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Guest List", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /guest list/i })).toBeTruthy();
  });

  it("shows correct initial stats", () => {
    const stats = screen.getByTestId("stats");
    expect(stats.textContent).toMatch(/Total: 6/);
    expect(stats.textContent).toMatch(/Confirmed: 3/);
    expect(stats.textContent).toMatch(/Pending: 2/);
    expect(stats.textContent).toMatch(/Declined: 1/);
  });

  it("renders all seed guest rows", () => {
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`guest-row-${i}`)).toBeTruthy();
    }
  });

  it("shows correct rsvp values", () => {
    expect(screen.getByTestId("rsvp-1").textContent).toBe("confirmed");
    expect(screen.getByTestId("rsvp-2").textContent).toBe("pending");
    expect(screen.getByTestId("rsvp-4").textContent).toBe("declined");
  });

  it("shows plus one as Yes/No", () => {
    expect(screen.getByTestId("plusone-1").textContent).toBe("Yes");
    expect(screen.getByTestId("plusone-2").textContent).toBe("No");
  });

  it("filters by confirmed", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-confirmed"));
    expect(screen.getByTestId("guest-row-1")).toBeTruthy();
    expect(screen.queryByTestId("guest-row-2")).toBeNull();
    expect(screen.queryByTestId("guest-row-4")).toBeNull();
  });

  it("filters by pending", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-pending"));
    expect(screen.getByTestId("guest-row-2")).toBeTruthy();
    expect(screen.getByTestId("guest-row-5")).toBeTruthy();
    expect(screen.queryByTestId("guest-row-1")).toBeNull();
  });

  it("search filters by name case-insensitively", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/search guests/i), "alice");
    expect(screen.getByTestId("guest-row-1")).toBeTruthy();
    expect(screen.queryByTestId("guest-row-2")).toBeNull();
  });

  it("removes a guest and updates stats", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("remove-btn-4"));
    expect(screen.queryByTestId("guest-row-4")).toBeNull();
    const stats = screen.getByTestId("stats");
    expect(stats.textContent).toMatch(/Total: 5/);
    expect(stats.textContent).toMatch(/Declined: 0/);
  });

  it("adds a new guest", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-guest-btn"));
    await user.type(screen.getByLabelText(/^name/i), "Grace Kelly");
    await user.click(screen.getByRole("button", { name: /save/i }));
    const stats = screen.getByTestId("stats");
    expect(stats.textContent).toMatch(/Total: 7/);
    expect(screen.getByText("Grace Kelly")).toBeTruthy();
  });

  it("does not add guest with empty name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-guest-btn"));
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByTestId("stats").textContent).toMatch(/Total: 6/);
  });

  it("edits a guest and updates the row", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-2"));
    const rsvpSelect = screen.getByLabelText(/^rsvp/i);
    await user.selectOptions(rsvpSelect, "confirmed");
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByTestId("rsvp-2").textContent).toBe("confirmed");
  });

  it("cancel on edit form does not change guest", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-2"));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.getByTestId("rsvp-2").textContent).toBe("pending");
  });
});
