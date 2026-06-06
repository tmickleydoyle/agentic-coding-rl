import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Internship Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /internship tracker/i })).toBeTruthy();
  });

  it("shows 4 seed applications", () => {
    expect(screen.getAllByTestId("application-item")).toHaveLength(4);
  });

  it("displays correct seed company names", () => {
    const companies = screen.getAllByTestId("app-company").map((el) => el.textContent);
    expect(companies).toContain("Google");
    expect(companies).toContain("Meta");
  });

  it("shows correct summary counts for seed data", () => {
    expect(screen.getByTestId("count-total").textContent).toContain("4");
    expect(screen.getByTestId("count-interviews").textContent).toContain("1");
    expect(screen.getByTestId("count-offers").textContent).toContain("1");
  });

  it("adds a new application", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-company"), "Netflix");
    await user.type(screen.getByTestId("input-role"), "Data Intern");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByTestId("application-item")).toHaveLength(5);
    const companies = screen.getAllByTestId("app-company").map((el) => el.textContent);
    expect(companies).toContain("Netflix");
  });

  it("shows error when company is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-role"), "Intern");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
    expect(screen.getAllByTestId("application-item")).toHaveLength(4);
  });

  it("shows error when role is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-company"), "Acme");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("clears form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-company"), "Uber");
    await user.type(screen.getByTestId("input-role"), "Ops Intern");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-company") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("input-role") as HTMLInputElement).value).toBe("");
  });

  it("deletes an application", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("application-item");
    const deleteBtn = within(items[0]).getByTestId("btn-delete");
    await user.click(deleteBtn);
    expect(screen.getAllByTestId("application-item")).toHaveLength(3);
  });

  it("filters by Interview status", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Interview"));
    const items = screen.getAllByTestId("application-item");
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByTestId("app-company").textContent).toBe("Meta");
  });

  it("filters by Offer status", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Offer"));
    const items = screen.getAllByTestId("application-item");
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByTestId("app-status").textContent).toBe("Offer");
  });

  it("filter All restores full list after filtering", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Rejected"));
    expect(screen.getAllByTestId("application-item")).toHaveLength(1);
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getAllByTestId("application-item")).toHaveLength(4);
  });

  it("updates total count after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-company"), "Lyft");
    await user.type(screen.getByTestId("input-role"), "PM Intern");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("count-total").textContent).toContain("5");
  });

  it("updates interview count after adding an interview application", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-company"), "Apple");
    await user.type(screen.getByTestId("input-role"), "iOS Intern");
    await userEvent.selectOptions(screen.getByTestId("select-status"), "Interview");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("count-interviews").textContent).toContain("2");
  });
});
