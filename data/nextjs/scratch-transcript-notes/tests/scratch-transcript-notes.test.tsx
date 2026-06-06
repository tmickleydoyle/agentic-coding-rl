import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Transcript Notes", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /transcript notes/i })).toBeTruthy();
  });

  it("shows 3 seed annotations on load", () => {
    expect(screen.getAllByTestId("annotation-card").length).toBe(3);
  });

  it("shows correct initial count", () => {
    expect(screen.getByTestId("annotation-count").textContent).toContain("3");
  });

  it("displays seed annotation show name", () => {
    const shows = screen.getAllByTestId("annotation-show");
    expect(shows[0].textContent).toBe("Hidden Brain");
  });

  it("displays seed annotation tags", () => {
    const tags = screen.getAllByTestId("annotation-tag");
    expect(tags[1].textContent).toBe("economics");
  });

  it("adds a new annotation", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/show/i), "New Show");
    await user.type(screen.getByLabelText(/speaker/i), "Host Name");
    await user.type(screen.getByLabelText(/quote/i), "A great quote");
    await user.type(screen.getByLabelText(/tag/i), "science");
    await user.type(screen.getByLabelText(/commentary/i), "My thoughts");
    await user.click(screen.getByRole("button", { name: /add annotation/i }));
    expect(screen.getAllByTestId("annotation-card").length).toBe(4);
  });

  it("shows error when fields are empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add annotation/i }));
    expect(screen.getByTestId("error-message").textContent).toContain("All fields are required");
  });

  it("does not add annotation on validation failure", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/show/i), "Show Only");
    await user.click(screen.getByRole("button", { name: /add annotation/i }));
    expect(screen.getAllByTestId("annotation-card").length).toBe(3);
  });

  it("deletes an annotation", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("annotation-card");
    await user.click(within(cards[0]).getByRole("button", { name: /delete/i }));
    expect(screen.getAllByTestId("annotation-card").length).toBe(2);
  });

  it("updates count after delete", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("annotation-card");
    await user.click(within(cards[0]).getByRole("button", { name: /delete/i }));
    expect(screen.getByTestId("annotation-count").textContent).toContain("2");
  });

  it("enters edit mode on Edit click", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("annotation-card");
    await user.click(within(cards[0]).getByRole("button", { name: /edit/i }));
    expect(within(cards[0]).getByTestId("commentary-input")).toBeTruthy();
  });

  it("saves edited commentary", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("annotation-card");
    await user.click(within(cards[0]).getByRole("button", { name: /edit/i }));
    const input = within(cards[0]).getByTestId("commentary-input");
    await user.clear(input);
    await user.type(input, "Updated commentary");
    await user.click(within(cards[0]).getByRole("button", { name: /save/i }));
    expect(within(cards[0]).getByTestId("annotation-commentary").textContent).toBe("Updated commentary");
  });

  it("filters by tag shows only matching cards", async () => {
    const user = userEvent.setup();
    const select = screen.getByTestId("tag-filter");
    await user.selectOptions(select, "psychology");
    expect(screen.getAllByTestId("annotation-card").length).toBe(1);
  });

  it("All filter shows all annotations", async () => {
    const user = userEvent.setup();
    const select = screen.getByTestId("tag-filter");
    await user.selectOptions(select, "economics");
    await user.selectOptions(select, "All");
    expect(screen.getAllByTestId("annotation-card").length).toBe(3);
  });

  it("count reflects total not filtered count", async () => {
    const user = userEvent.setup();
    const select = screen.getByTestId("tag-filter");
    await user.selectOptions(select, "psychology");
    expect(screen.getByTestId("annotation-count").textContent).toContain("3");
  });
});
