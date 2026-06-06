import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("College Application Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /college application tracker/i })).toBeTruthy();
  });

  it("shows 4 seed applications", () => {
    expect(screen.getAllByTestId("app-item")).toHaveLength(4);
  });

  it("displays seed school names", () => {
    const schools = screen.getAllByTestId("app-school").map((el) => el.textContent);
    expect(schools).toContain("MIT");
    expect(schools).toContain("Harvard");
  });

  it("shows correct summary counts for seed data", () => {
    expect(screen.getByTestId("count-total").textContent).toContain("4");
    expect(screen.getByTestId("count-accepted").textContent).toContain("1");
    expect(screen.getByTestId("count-pending").textContent).toContain("3");
  });

  it("adds a new application", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-school"), "Yale");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByTestId("app-item")).toHaveLength(5);
    const schools = screen.getAllByTestId("app-school").map((el) => el.textContent);
    expect(schools).toContain("Yale");
  });

  it("shows error when school is empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
    expect(screen.getAllByTestId("app-item")).toHaveLength(4);
  });

  it("clears form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-school"), "Princeton");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-school") as HTMLInputElement).value).toBe("");
  });

  it("deletes an application", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("app-item");
    await user.click(within(items[0]).getByTestId("btn-delete"));
    expect(screen.getAllByTestId("app-item")).toHaveLength(3);
  });

  it("updates counts after delete", async () => {
    const user = userEvent.setup();
    // Delete Harvard (Accepted)
    const items = screen.getAllByTestId("app-item");
    const harvardItem = items.find((el) => within(el).getByTestId("app-school").textContent === "Harvard");
    if (harvardItem) {
      await user.click(within(harvardItem).getByTestId("btn-delete"));
    }
    expect(screen.getByTestId("count-accepted").textContent).toContain("0");
    expect(screen.getByTestId("count-total").textContent).toContain("3");
  });

  it("filters by Accepted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Accepted"));
    const items = screen.getAllByTestId("app-item");
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByTestId("app-school").textContent).toBe("Harvard");
  });

  it("filters by Pending", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Pending"));
    expect(screen.getAllByTestId("app-item")).toHaveLength(3);
  });

  it("filter All restores full list", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Accepted"));
    expect(screen.getAllByTestId("app-item")).toHaveLength(1);
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getAllByTestId("app-item")).toHaveLength(4);
  });

  it("displays essay status for each application", () => {
    const essays = screen.getAllByTestId("app-essay").map((el) => el.textContent);
    expect(essays).toContain("Done");
    expect(essays).toContain("In Progress");
    expect(essays).toContain("Not Started");
  });
});
