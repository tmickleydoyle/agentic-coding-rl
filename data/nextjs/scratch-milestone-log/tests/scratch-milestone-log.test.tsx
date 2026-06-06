import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Milestone Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /milestone log/i })).toBeTruthy();
  });

  it("renders all seed milestones", () => {
    expect(screen.getAllByTestId("milestone-item").length).toBe(5);
  });

  it("shows correct total count from seed data", () => {
    expect(screen.getByTestId("total-milestones").textContent).toMatch(/5/);
  });

  it("shows correct achieved count from seed data", () => {
    // ids 1, 2, 3 are achieved = 3
    expect(screen.getByTestId("achieved-count").textContent).toMatch(/3/);
  });

  it("shows correct pending count from seed data", () => {
    // ids 4, 5 not achieved = 2
    expect(screen.getByTestId("pending-count").textContent).toMatch(/2/);
  });

  it("displays achieved=true as 'Yes' and achieved=false as 'No'", () => {
    const items = screen.getAllByTestId("milestone-item");
    // Seed newest-first: id5=No, id4=No, id3=Yes, id2=Yes, id1=Yes
    expect(within(items[0]).getByTestId("milestone-achieved").textContent).toBe("No");
    expect(within(items[2]).getByTestId("milestone-achieved").textContent).toBe("Yes");
  });

  it("adds a new milestone and shows it at the top", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^title$/i), "First steps");
    await user.type(screen.getByLabelText(/^date$/i), "2024-11-01");
    await user.type(screen.getByLabelText(/^description$/i), "Took first steps unassisted");
    await user.click(screen.getByRole("button", { name: /add milestone/i }));

    const items = screen.getAllByTestId("milestone-item");
    expect(items.length).toBe(6);
    expect(within(items[0]).getByTestId("milestone-title").textContent).toBe("First steps");
  });

  it("resets form after adding a milestone", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^title$/i), "First steps");
    await user.type(screen.getByLabelText(/^date$/i), "2024-11-01");
    await user.click(screen.getByRole("button", { name: /add milestone/i }));

    expect((screen.getByLabelText(/^title$/i) as HTMLInputElement).value).toBe("");
  });

  it("does not add milestone when title is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^date$/i), "2024-11-01");
    await user.click(screen.getByRole("button", { name: /add milestone/i }));

    expect(screen.getAllByTestId("milestone-item").length).toBe(5);
  });

  it("does not add milestone when date is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^title$/i), "First steps");
    await user.click(screen.getByRole("button", { name: /add milestone/i }));

    expect(screen.getAllByTestId("milestone-item").length).toBe(5);
  });

  it("adds achieved milestone and updates achieved count", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^title$/i), "Crawling");
    await user.type(screen.getByLabelText(/^date$/i), "2024-07-15");
    await user.click(screen.getByLabelText(/achieved/i));
    await user.click(screen.getByRole("button", { name: /add milestone/i }));

    expect(screen.getByTestId("achieved-count").textContent).toMatch(/4/);
    expect(screen.getByTestId("pending-count").textContent).toMatch(/2/);
  });

  it("deletes a milestone", async () => {
    const user = userEvent.setup();
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);
    expect(screen.getAllByTestId("milestone-item").length).toBe(4);
  });

  it("updates summary counts after deletion", async () => {
    const user = userEvent.setup();
    // First item is id5 (language, not achieved)
    await user.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    expect(screen.getByTestId("total-milestones").textContent).toMatch(/4/);
    expect(screen.getByTestId("pending-count").textContent).toMatch(/1/);
  });

  it("filters by category", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/filter by category/i), "motor");
    const items = screen.getAllByTestId("milestone-item");
    items.forEach((item) => {
      expect(within(item).getByTestId("milestone-category").textContent).toBe("motor");
    });
    expect(items.length).toBe(2);
  });

  it("filter All shows all entries", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/filter by category/i), "social");
    await user.selectOptions(screen.getByLabelText(/filter by category/i), "all");
    expect(screen.getAllByTestId("milestone-item").length).toBe(5);
  });

  it("summary counts not affected by filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/filter by category/i), "cognitive");
    // Only 1 shown in list but totals remain 5
    expect(screen.getByTestId("total-milestones").textContent).toMatch(/5/);
  });
});
