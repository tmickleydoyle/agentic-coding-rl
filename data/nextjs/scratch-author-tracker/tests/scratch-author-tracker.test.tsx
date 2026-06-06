import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

beforeEach(() => {
  render(<App />);
});

describe("Seed data", () => {
  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /author tracker/i })).toBeTruthy();
  });

  it("shows Ursula K. Le Guin", () => {
    expect(screen.getByTestId("author-name-1").textContent).toBe("Ursula K. Le Guin");
  });

  it("shows books read for first author", () => {
    expect(screen.getByTestId("author-books-1").textContent).toBe("Books Read: 7");
  });

  it("shows rating for first author", () => {
    expect(screen.getByTestId("author-rating-1").textContent).toBe("Rating: 5/5");
  });
});

describe("Stats", () => {
  it("shows correct total authors", () => {
    expect(screen.getByTestId("stat-total-authors").textContent).toContain("3");
  });

  it("shows correct total books read from seed", () => {
    expect(screen.getByTestId("stat-total-books").textContent).toContain("23");
  });
});

describe("Add author", () => {
  it("adds a valid author", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Toni Morrison");
    await user.type(screen.getByTestId("input-genre"), "Literary Fiction");
    await user.type(screen.getByTestId("input-books-read"), "3");
    await user.type(screen.getByTestId("input-rating"), "5");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("Toni Morrison")).toBeTruthy();
  });

  it("resets form after add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Leo Tolstoy");
    await user.type(screen.getByTestId("input-genre"), "Classic");
    await user.type(screen.getByTestId("input-books-read"), "2");
    await user.type(screen.getByTestId("input-rating"), "5");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe("");
  });

  it("rejects add when name is blank", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-genre"), "Genre");
    await user.type(screen.getByTestId("input-books-read"), "1");
    await user.type(screen.getByTestId("input-rating"), "3");
    await user.click(screen.getByTestId("btn-add"));
    const list = screen.getByTestId("author-list");
    expect(within(list).getAllByRole("listitem").length).toBe(3);
  });

  it("rejects add when rating is 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Bad Rating Author");
    await user.type(screen.getByTestId("input-genre"), "Genre");
    await user.type(screen.getByTestId("input-books-read"), "1");
    await user.type(screen.getByTestId("input-rating"), "0");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByText("Bad Rating Author")).toBeNull();
  });

  it("rejects add when rating is 6", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Over Rated");
    await user.type(screen.getByTestId("input-genre"), "Genre");
    await user.type(screen.getByTestId("input-books-read"), "1");
    await user.type(screen.getByTestId("input-rating"), "6");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByText("Over Rated")).toBeNull();
  });
});

describe("Delete author", () => {
  it("removes author when Delete is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("author-card-1")).toBeNull();
  });

  it("updates total authors stat after delete", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.getByTestId("stat-total-authors").textContent).toContain("2");
  });
});

describe("Increment books read", () => {
  it("increments books read by 1", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-increment-1"));
    expect(screen.getByTestId("author-books-1").textContent).toBe("Books Read: 8");
  });

  it("updates total books stat on increment", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-increment-1"));
    expect(screen.getByTestId("stat-total-books").textContent).toContain("24");
  });
});

describe("Filter by genre", () => {
  it("filters authors by genre (case insensitive)", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-genre"), "mystery");
    expect(screen.getByTestId("author-card-3")).toBeTruthy();
    expect(screen.queryByTestId("author-card-1")).toBeNull();
  });

  it("clearing filter shows all authors", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-genre"), "mystery");
    await user.clear(screen.getByTestId("filter-genre"));
    expect(screen.getByTestId("author-card-1")).toBeTruthy();
    expect(screen.getByTestId("author-card-2")).toBeTruthy();
  });
});
