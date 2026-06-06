import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

beforeEach(() => {
  render(<App />);
});

describe("Seed data", () => {
  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /book summary log/i })).toBeTruthy();
  });

  it("shows The Great Gatsby on load", () => {
    expect(screen.getByTestId("book-title-1").textContent).toBe("The Great Gatsby");
  });

  it("shows Sapiens on load", () => {
    expect(screen.getByTestId("book-title-2").textContent).toBe("Sapiens");
  });

  it("shows Dune on load", () => {
    expect(screen.getByTestId("book-title-3").textContent).toBe("Dune");
  });

  it("displays rating as X/5 format", () => {
    expect(screen.getByTestId("book-rating-1").textContent).toBe("Rating: 4/5");
  });
});

describe("Add book", () => {
  it("adds a valid new book", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "New Book");
    await user.type(screen.getByTestId("input-author"), "New Author");
    await user.type(screen.getByTestId("input-genre"), "Drama");
    await user.clear(screen.getByTestId("input-rating"));
    await user.type(screen.getByTestId("input-rating"), "3");
    await user.type(screen.getByTestId("input-summary"), "A great drama.");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("New Book")).toBeTruthy();
  });

  it("resets form fields after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Reset Test");
    await user.type(screen.getByTestId("input-author"), "Author X");
    await user.type(screen.getByTestId("input-genre"), "Mystery");
    await user.clear(screen.getByTestId("input-rating"));
    await user.type(screen.getByTestId("input-rating"), "4");
    await user.type(screen.getByTestId("input-summary"), "Summary here.");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-title") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("input-summary") as HTMLTextAreaElement).value).toBe("");
  });

  it("rejects add when title is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-author"), "Author");
    await user.type(screen.getByTestId("input-genre"), "Genre");
    await user.type(screen.getByTestId("input-rating"), "3");
    await user.type(screen.getByTestId("input-summary"), "Summary");
    await user.click(screen.getByTestId("btn-add"));
    const list = screen.getByTestId("book-list");
    expect(within(list).getAllByRole("listitem").length).toBe(3);
  });

  it("rejects add when rating is 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Bad Rating");
    await user.type(screen.getByTestId("input-author"), "Author");
    await user.type(screen.getByTestId("input-genre"), "Genre");
    await user.clear(screen.getByTestId("input-rating"));
    await user.type(screen.getByTestId("input-rating"), "0");
    await user.type(screen.getByTestId("input-summary"), "Summary");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByText("Bad Rating")).toBeNull();
  });

  it("rejects add when rating is 6", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Too High");
    await user.type(screen.getByTestId("input-author"), "Author");
    await user.type(screen.getByTestId("input-genre"), "Genre");
    await user.clear(screen.getByTestId("input-rating"));
    await user.type(screen.getByTestId("input-rating"), "6");
    await user.type(screen.getByTestId("input-summary"), "Summary");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByText("Too High")).toBeNull();
  });
});

describe("Delete book", () => {
  it("removes a book when Delete is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("book-card-1")).toBeNull();
  });

  it("does not remove other books on delete", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.getByTestId("book-card-2")).toBeTruthy();
    expect(screen.getByTestId("book-card-3")).toBeTruthy();
  });
});

describe("Filter by genre", () => {
  it("filters books by genre (case insensitive)", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-genre"), "fiction");
    expect(screen.getByTestId("book-card-1")).toBeTruthy();
    expect(screen.queryByTestId("book-card-2")).toBeNull();
  });

  it("clearing filter shows all books", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-genre"), "sci-fi");
    await user.clear(screen.getByTestId("filter-genre"));
    expect(screen.getByTestId("book-card-1")).toBeTruthy();
    expect(screen.getByTestId("book-card-2")).toBeTruthy();
    expect(screen.getByTestId("book-card-3")).toBeTruthy();
  });
});
