import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

beforeEach(() => {
  render(<App />);
});

describe("Seed data", () => {
  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /reading speed tracker/i })).toBeTruthy();
  });

  it("shows first seed session", () => {
    expect(screen.getByTestId("session-book-1").textContent).toBe("Dune");
  });

  it("shows computed speed for seed session 1", () => {
    expect(screen.getByTestId("session-speed-1").textContent).toContain("pages/min");
  });

  it("shows all three seed sessions", () => {
    const list = screen.getByTestId("session-list");
    expect(within(list).getAllByRole("listitem").length).toBe(3);
  });
});

describe("Stats panel", () => {
  it("shows correct total pages for seed data", () => {
    expect(screen.getByTestId("stat-total-pages").textContent).toContain("100");
  });

  it("shows correct total minutes for seed data", () => {
    expect(screen.getByTestId("stat-total-minutes").textContent).toContain("130");
  });

  it("shows average speed", () => {
    const avgText = screen.getByTestId("stat-avg-speed").textContent ?? "";
    expect(avgText).toContain("pages/min");
  });
});

describe("Add session", () => {
  it("adds a valid session", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-book"), "Cosmos");
    await user.type(screen.getByTestId("input-pages"), "40");
    await user.type(screen.getByTestId("input-minutes"), "50");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("Cosmos")).toBeTruthy();
  });

  it("resets form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-book"), "TestBook");
    await user.type(screen.getByTestId("input-pages"), "10");
    await user.type(screen.getByTestId("input-minutes"), "15");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-book") as HTMLInputElement).value).toBe("");
  });

  it("rejects add when pages = 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-book"), "Zero Pages");
    await user.type(screen.getByTestId("input-pages"), "0");
    await user.type(screen.getByTestId("input-minutes"), "10");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByText("Zero Pages")).toBeNull();
  });

  it("rejects add when minutes = 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-book"), "Zero Minutes");
    await user.type(screen.getByTestId("input-pages"), "10");
    await user.type(screen.getByTestId("input-minutes"), "0");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByText("Zero Minutes")).toBeNull();
  });

  it("updates total pages stat after add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-book"), "Extra");
    await user.type(screen.getByTestId("input-pages"), "10");
    await user.type(screen.getByTestId("input-minutes"), "10");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("stat-total-pages").textContent).toContain("110");
  });
});

describe("Delete session", () => {
  it("removes session when Delete is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("session-card-1")).toBeNull();
  });

  it("updates stats after delete", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    await user.click(screen.getByTestId("btn-delete-2"));
    await user.click(screen.getByTestId("btn-delete-3"));
    expect(screen.getByTestId("stat-total-pages").textContent).toContain("0");
    expect(screen.getByTestId("stat-avg-speed").textContent).toContain("0.00 pages/min");
  });
});
