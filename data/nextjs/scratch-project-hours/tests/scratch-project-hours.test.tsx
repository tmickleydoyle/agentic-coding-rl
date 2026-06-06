import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Project Hours", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByTestId("page-heading")).toHaveTextContent("Project Hours");
  });

  it("shows correct total hours for seed data", () => {
    // 3+5+2+4+6 = 20
    expect(screen.getByTestId("total-hours")).toHaveTextContent("Total: 20 hrs");
  });

  it("renders all 5 seed entries", () => {
    expect(screen.getByTestId("entry-row-1")).toBeInTheDocument();
    expect(screen.getByTestId("entry-row-5")).toBeInTheDocument();
  });

  it("displays project name on each entry", () => {
    expect(screen.getByTestId("entry-project-1")).toHaveTextContent("Website Redesign");
    expect(screen.getByTestId("entry-project-2")).toHaveTextContent("Mobile App");
  });

  it("shows per-project totals", () => {
    expect(screen.getByTestId("project-total-Website-Redesign")).toHaveTextContent("5 hrs");
    expect(screen.getByTestId("project-total-Mobile-App")).toHaveTextContent("11 hrs");
    expect(screen.getByTestId("project-total-API-Integration")).toHaveTextContent("4 hrs");
  });

  it("logging an entry adds it to the list and updates total", async () => {
    await userEvent.type(screen.getByTestId("form-project"), "New Project");
    await userEvent.type(screen.getByTestId("form-hours"), "3");
    await userEvent.click(screen.getByTestId("log-btn"));
    expect(screen.getByTestId("total-hours")).toHaveTextContent("Total: 23 hrs");
    expect(screen.getByText("New Project")).toBeInTheDocument();
  });

  it("form resets after logging", async () => {
    await userEvent.type(screen.getByTestId("form-project"), "Temp");
    await userEvent.type(screen.getByTestId("form-hours"), "2");
    await userEvent.click(screen.getByTestId("log-btn"));
    expect(screen.getByTestId("form-project")).toHaveValue("");
    expect(screen.getByTestId("form-hours")).toHaveValue(null);
  });

  it("does not log entry if hours is 0", async () => {
    await userEvent.type(screen.getByTestId("form-project"), "Bad Entry");
    await userEvent.type(screen.getByTestId("form-hours"), "0");
    await userEvent.click(screen.getByTestId("log-btn"));
    expect(screen.getByTestId("total-hours")).toHaveTextContent("Total: 20 hrs");
  });

  it("does not log entry if project is empty", async () => {
    await userEvent.type(screen.getByTestId("form-hours"), "5");
    await userEvent.click(screen.getByTestId("log-btn"));
    expect(screen.getByTestId("total-hours")).toHaveTextContent("Total: 20 hrs");
  });

  it("deleting an entry updates the total", async () => {
    await userEvent.click(screen.getByTestId("delete-entry-1"));
    expect(screen.getByTestId("total-hours")).toHaveTextContent("Total: 17 hrs");
    expect(screen.queryByTestId("entry-row-1")).not.toBeInTheDocument();
  });

  it("filter by project shows only matching entries", async () => {
    const select = screen.getByTestId("filter-project");
    await userEvent.selectOptions(select, "Mobile App");
    expect(screen.getByTestId("entry-row-2")).toBeInTheDocument();
    expect(screen.getByTestId("entry-row-5")).toBeInTheDocument();
    expect(screen.queryByTestId("entry-row-1")).not.toBeInTheDocument();
  });

  it("project totals are not affected by filter", async () => {
    const select = screen.getByTestId("filter-project");
    await userEvent.selectOptions(select, "Mobile App");
    expect(screen.getByTestId("project-total-Website-Redesign")).toBeInTheDocument();
    expect(screen.getByTestId("project-total-API-Integration")).toBeInTheDocument();
  });

  it("shows empty state when filter has no matches", async () => {
    await userEvent.type(screen.getByTestId("form-project"), "Solo Project");
    await userEvent.type(screen.getByTestId("form-hours"), "1");
    await userEvent.click(screen.getByTestId("log-btn"));
    const select = screen.getByTestId("filter-project");
    await userEvent.selectOptions(select, "Solo Project");
    await userEvent.click(screen.getByTestId("delete-entry-6"));
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });
});
