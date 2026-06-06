import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Job Search Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByText("Job Search Tracker")).toBeTruthy();
  });

  it("renders all 5 seed jobs initially", () => {
    expect(screen.getByTestId("job-card-1")).toBeTruthy();
    expect(screen.getByTestId("job-card-2")).toBeTruthy();
    expect(screen.getByTestId("job-card-3")).toBeTruthy();
    expect(screen.getByTestId("job-card-4")).toBeTruthy();
    expect(screen.getByTestId("job-card-5")).toBeTruthy();
  });

  it("shows correct status badges for seed data", () => {
    expect(screen.getByTestId("status-1").textContent).toBe("Applied");
    expect(screen.getByTestId("status-2").textContent).toBe("Interview");
    expect(screen.getByTestId("status-3").textContent).toBe("Offer");
    expect(screen.getByTestId("status-4").textContent).toBe("Rejected");
  });

  it("filters by status", async () => {
    const filter = screen.getByTestId("status-filter");
    await userEvent.selectOptions(filter, "Interview");
    expect(screen.queryByTestId("job-card-2")).toBeTruthy();
    expect(screen.queryByTestId("job-card-1")).toBeNull();
    expect(screen.queryByTestId("job-card-4")).toBeNull();
  });

  it("filters by search query on company", async () => {
    const search = screen.getByTestId("search-input");
    await userEvent.type(search, "Acme");
    expect(screen.queryByTestId("job-card-1")).toBeTruthy();
    expect(screen.queryByTestId("job-card-2")).toBeNull();
  });

  it("filters by search query on role (case-insensitive)", async () => {
    const search = screen.getByTestId("search-input");
    await userEvent.type(search, "react");
    expect(screen.queryByTestId("job-card-3")).toBeTruthy();
    expect(screen.queryByTestId("job-card-1")).toBeNull();
  });

  it("shows empty state when no results match", async () => {
    const search = screen.getByTestId("search-input");
    await userEvent.type(search, "zzznomatch");
    expect(screen.getByTestId("empty-state")).toBeTruthy();
  });

  it("adds a new job application", async () => {
    await userEvent.type(screen.getByTestId("input-company"), "NewCo");
    await userEvent.type(screen.getByTestId("input-role"), "Dev");
    await userEvent.type(screen.getByTestId("input-location"), "Remote");
    fireEvent.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("job-card-6")).toBeTruthy();
    expect(screen.getByText("NewCo")).toBeTruthy();
  });

  it("does not add job when company is empty", async () => {
    await userEvent.type(screen.getByTestId("input-role"), "Dev");
    fireEvent.click(screen.getByTestId("add-btn"));
    expect(screen.queryByTestId("job-card-6")).toBeNull();
  });

  it("deletes a job application", async () => {
    fireEvent.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("job-card-1")).toBeNull();
  });

  it("enters edit mode when edit button clicked", async () => {
    fireEvent.click(screen.getByTestId("edit-1"));
    expect(screen.getByTestId("save-1")).toBeTruthy();
    expect(screen.getByTestId("cancel-1")).toBeTruthy();
  });

  it("saves edited job data", async () => {
    fireEvent.click(screen.getByTestId("edit-1"));
    const companyInput = screen.getByTestId("edit-company-1");
    await userEvent.clear(companyInput);
    await userEvent.type(companyInput, "Updated Corp");
    fireEvent.click(screen.getByTestId("save-1"));
    expect(screen.getByText("Updated Corp")).toBeTruthy();
    expect(screen.queryByTestId("save-1")).toBeNull();
  });

  it("cancels edit without saving changes", async () => {
    fireEvent.click(screen.getByTestId("edit-1"));
    const companyInput = screen.getByTestId("edit-company-1");
    await userEvent.clear(companyInput);
    await userEvent.type(companyInput, "Should Not Save");
    fireEvent.click(screen.getByTestId("cancel-1"));
    expect(screen.queryByText("Should Not Save")).toBeNull();
    expect(screen.getByText("Acme Corp")).toBeTruthy();
  });
});
