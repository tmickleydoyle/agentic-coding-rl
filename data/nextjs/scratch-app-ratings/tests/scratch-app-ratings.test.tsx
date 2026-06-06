import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("App Ratings", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /app ratings/i })).toBeTruthy();
  });

  it("shows total app count", () => {
    expect(screen.getByTestId("total-apps").textContent).toBe("5");
  });

  it("shows average rating to 1 decimal", () => {
    // (5+3+5+2+4)/5 = 3.8
    expect(screen.getByTestId("average-rating").textContent).toBe("3.8");
  });

  it("renders all 5 seed apps", () => {
    expect(screen.getAllByTestId("app-item").length).toBe(5);
  });

  it("each app shows rating as X/5", () => {
    const ratings = screen.getAllByTestId("app-rating");
    expect(ratings.length).toBe(5);
    ratings.forEach((r) => {
      expect(r.textContent).toMatch(/^\d\/5$/);
    });
  });

  it("sort by rating orders highest first", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("sort-rating"));
    const items = screen.getAllByTestId("app-item");
    const firstRating = within(items[0]).getByTestId("app-rating").textContent;
    expect(firstRating).toBe("5/5");
  });

  it("sort by name orders alphabetically", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("sort-name"));
    const items = screen.getAllByTestId("app-item");
    const names = items.map((i) => i.textContent ?? "");
    expect(names[0]).toContain("Figma");
  });

  it("category filter narrows the list", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Editor");
    const items = screen.getAllByTestId("app-item");
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain("VS Code");
  });

  it("shows empty message when category filter matches nothing", async () => {
    const user = userEvent.setup();
    // First add a custom category app, then filter to an unmatched one via selecting existing
    // Use Design (Figma) category, then delete Figma to create empty
    await user.selectOptions(screen.getByTestId("filter-category"), "Design");
    const items = screen.getAllByTestId("app-item");
    await user.click(within(items[0]).getByTestId("remove-app-btn"));
    expect(screen.getByTestId("empty-message")).toBeTruthy();
  });

  it("can add a new app", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Zed");
    await user.type(screen.getByTestId("input-category"), "Editor");
    await user.type(screen.getByTestId("input-rating"), "4");
    await user.click(screen.getByRole("button", { name: /add app/i }));
    expect(screen.getAllByTestId("app-item").length).toBe(6);
    expect(screen.getByTestId("total-apps").textContent).toBe("6");
  });

  it("average rating updates after adding an app", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "TestApp");
    await user.type(screen.getByTestId("input-rating"), "5");
    await user.click(screen.getByRole("button", { name: /add app/i }));
    // (5+3+5+2+4+5)/6 = 4.0
    expect(screen.getByTestId("average-rating").textContent).toBe("4.0");
  });

  it("can remove an app", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("app-item");
    await user.click(within(items[0]).getByTestId("remove-app-btn"));
    expect(screen.getAllByTestId("app-item").length).toBe(4);
  });

  it("does not add app with empty name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-rating"), "3");
    await user.click(screen.getByRole("button", { name: /add app/i }));
    expect(screen.getAllByTestId("app-item").length).toBe(5);
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    await user.type(nameInput, "Tool");
    await user.type(screen.getByTestId("input-rating"), "3");
    await user.click(screen.getByRole("button", { name: /add app/i }));
    expect(nameInput.value).toBe("");
  });
});
