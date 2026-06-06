import { describe, it, expect, beforeEach } from "vitest";
import { getGroups, addGroup, removeGroup, getContacts, addContact, removeContact, toggleFavorite, getFavorites, __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("store - groups", () => {
  it("returns initial groups", () => {
    expect(getGroups().length).toBe(2);
  });

  it("adds a group", () => {
    addGroup({ name: "Friends", color: "green" });
    expect(getGroups().length).toBe(3);
  });

  it("removes a group", () => {
    removeGroup("g1");
    expect(getGroups().length).toBe(1);
  });
});

describe("store - contacts", () => {
  it("returns initial contacts", () => {
    expect(getContacts().length).toBe(3);
  });

  it("adds a contact", () => {
    addContact({ name: "Dave", email: "dave@example.com", phone: "555-0004", address: "", groupId: "g1", favorite: false });
    expect(getContacts().length).toBe(4);
  });

  it("removes a contact", () => {
    removeContact("ct1");
    expect(getContacts().length).toBe(2);
  });

  it("toggles favorite", () => {
    const result = toggleFavorite("ct2");
    expect(result).not.toBeNull();
    expect(result!.favorite).toBe(true);
  });

  it("returns null for unknown contact", () => {
    expect(toggleFavorite("xxx")).toBeNull();
  });
});

describe("store - favorites", () => {
  it("returns initial favorites", () => {
    const favs = getFavorites();
    expect(favs.length).toBe(1);
    expect(favs[0].name).toBe("Alice Smith");
  });

  it("favorites increases after toggle", () => {
    toggleFavorite("ct2");
    expect(getFavorites().length).toBe(2);
  });
});
