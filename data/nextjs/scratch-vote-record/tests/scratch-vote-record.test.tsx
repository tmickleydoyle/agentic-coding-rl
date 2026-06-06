import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Vote Record Manager", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /vote record manager/i })).toBeTruthy();
  });

  it("shows correct stats from seed data", () => {
    expect(screen.getByTestId("total-count").textContent).toBe("5");
    expect(screen.getByTestId("counted-count").textContent).toBe("2");
    expect(screen.getByTestId("uncounted-count").textContent).toBe("3");
  });

  it("renders 5 voter rows from seed data", () => {
    const rows = screen.getAllByTestId("voter-row");
    expect(rows.length).toBe(5);
  });

  it("filters by precinct 4A shows 2 rows", async () => {
    const user = userEvent.setup();
    const filterInput = screen.getByTestId("precinct-filter");
    await user.type(filterInput, "4A");
    const rows = screen.getAllByTestId("voter-row");
    expect(rows.length).toBe(2);
    const names = rows.map((r) => within(r).getByTestId("voter-name").textContent);
    expect(names).toContain("James Okafor");
    expect(names).toContain("Luis Delgado");
  });

  it("filter is case insensitive", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("precinct-filter"), "2b");
    const rows = screen.getAllByTestId("voter-row");
    expect(rows.length).toBe(2);
  });

  it("stats bar reflects total dataset not filtered view", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("precinct-filter"), "4A");
    expect(screen.getByTestId("total-count").textContent).toBe("5");
  });

  it("toggling checkbox updates counted/uncounted stats", async () => {
    const user = userEvent.setup();
    const rows = screen.getAllByTestId("voter-row");
    const jamesRow = rows.find((r) =>
      within(r).getByTestId("voter-name").textContent === "James Okafor"
    );
    const checkbox = within(jamesRow!).getByTestId("counted-checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    await user.click(checkbox);
    expect(screen.getByTestId("counted-count").textContent).toBe("3");
    expect(screen.getByTestId("uncounted-count").textContent).toBe("2");
  });

  it("removes a voter row when Remove is clicked", async () => {
    const user = userEvent.setup();
    const rows = screen.getAllByTestId("voter-row");
    const priyaRow = rows.find((r) =>
      within(r).getByTestId("voter-name").textContent === "Priya Sharma"
    );
    await user.click(within(priyaRow!).getByTestId("remove-btn"));
    const remaining = screen.getAllByTestId("voter-row");
    expect(remaining.length).toBe(4);
    expect(screen.getByTestId("total-count").textContent).toBe("4");
  });

  it("adds a new voter and clears inputs", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("name-input"), "New Voter");
    await user.type(screen.getByTestId("precinct-input"), "5E");
    await user.click(screen.getByTestId("add-voter-btn"));

    const rows = screen.getAllByTestId("voter-row");
    expect(rows.length).toBe(6);
    expect(screen.getByTestId("total-count").textContent).toBe("6");

    const nameInput = screen.getByTestId("name-input") as HTMLInputElement;
    const precinctInput = screen.getByTestId("precinct-input") as HTMLInputElement;
    expect(nameInput.value).toBe("");
    expect(precinctInput.value).toBe("");
  });

  it("does not add voter if name is blank", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("precinct-input"), "5E");
    await user.click(screen.getByTestId("add-voter-btn"));
    expect(screen.getAllByTestId("voter-row").length).toBe(5);
  });

  it("does not add voter if precinct is blank", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("name-input"), "Only Name");
    await user.click(screen.getByTestId("add-voter-btn"));
    expect(screen.getAllByTestId("voter-row").length).toBe(5);
  });

  it("new voter appears when it matches current filter", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("precinct-filter"), "4A");
    await user.type(screen.getByTestId("name-input"), "New Resident");
    await user.type(screen.getByTestId("precinct-input"), "4A");
    await user.click(screen.getByTestId("add-voter-btn"));
    const rows = screen.getAllByTestId("voter-row");
    expect(rows.length).toBe(3);
  });
});
