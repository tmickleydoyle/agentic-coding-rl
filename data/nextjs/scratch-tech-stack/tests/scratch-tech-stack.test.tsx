import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Tech Stack", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /my tech stack/i })).toBeTruthy();
  });

  it("shows correct summary counts from seed data", () => {
    expect(screen.getByTestId("total-count").textContent).toBe("6");
    expect(screen.getByTestId("expert-count").textContent).toBe("3");
    expect(screen.getByTestId("intermediate-count").textContent).toBe("3");
    expect(screen.getByTestId("beginner-count").textContent).toBe("0");
  });

  it("renders all 6 seed tech items", () => {
    expect(screen.getAllByTestId("tech-item").length).toBe(6);
  });

  it("each item shows name, category, tags, description, proficiency", () => {
    const items = screen.getAllByTestId("tech-item");
    const first = items[0];
    expect(within(first).getByTestId("tech-name")).toBeTruthy();
    expect(within(first).getByTestId("tech-category")).toBeTruthy();
    expect(within(first).getByTestId("tech-tags")).toBeTruthy();
    expect(within(first).getByTestId("tech-description")).toBeTruthy();
    expect(within(first).getByTestId("tech-proficiency")).toBeTruthy();
  });

  it("filter by category narrows the list", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Language");
    const items = screen.getAllByTestId("tech-item");
    expect(items.length).toBe(2);
    items.forEach((item) => {
      expect(within(item).getByTestId("tech-category").textContent).toBe("Language");
    });
  });

  it("filter by proficiency narrows the list", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-proficiency"), "expert");
    const items = screen.getAllByTestId("tech-item");
    expect(items.length).toBe(3);
    items.forEach((item) => {
      expect(within(item).getByTestId("tech-proficiency").textContent).toBe("expert");
    });
  });

  it("tag search filters by tag substring", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-tag"), "devops");
    const items = screen.getAllByTestId("tech-item");
    expect(items.length).toBe(1);
    expect(within(items[0]).getByTestId("tech-name").textContent).toBe("Docker");
  });

  it("combined filters apply together", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-proficiency"), "expert");
    await user.type(screen.getByTestId("search-tag"), "ui");
    const items = screen.getAllByTestId("tech-item");
    expect(items.length).toBe(2);
  });

  it("shows empty message when no items match filters", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "DevOps");
    await user.selectOptions(screen.getByTestId("filter-proficiency"), "expert");
    expect(screen.getByTestId("empty-message")).toBeTruthy();
  });

  it("summary counts are NOT affected by filters", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Language");
    expect(screen.getByTestId("total-count").textContent).toBe("6");
    expect(screen.getByTestId("expert-count").textContent).toBe("3");
  });

  it("can add a new technology", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Rust");
    await user.type(screen.getByTestId("input-category"), "Language");
    await user.type(screen.getByTestId("input-tags"), "backend, systems");
    await user.click(screen.getByRole("button", { name: /add technology/i }));
    expect(screen.getAllByTestId("tech-item").length).toBe(7);
    expect(screen.getByTestId("total-count").textContent).toBe("7");
  });

  it("tags are split by comma on add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Rust");
    await user.type(screen.getByTestId("input-tags"), "backend, systems");
    await user.click(screen.getByRole("button", { name: /add technology/i }));
    await user.type(screen.getByTestId("search-tag"), "systems");
    expect(screen.getAllByTestId("tech-item").length).toBe(1);
  });

  it("can remove a tech item", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("tech-item");
    await user.click(within(items[0]).getByTestId("remove-tech-btn"));
    expect(screen.getAllByTestId("tech-item").length).toBe(5);
    expect(screen.getByTestId("total-count").textContent).toBe("5");
  });

  it("does not add tech with empty name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add technology/i }));
    expect(screen.getAllByTestId("tech-item").length).toBe(6);
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    await user.type(nameInput, "Elixir");
    await user.click(screen.getByRole("button", { name: /add technology/i }));
    expect(nameInput.value).toBe("");
  });
});
