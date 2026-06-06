import { describe, it, expect, beforeEach } from "vitest";
import { getRoommates, addRoommate, removeRoommate, getExpenses, addExpense, getSettlements, addSettlement, __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("store - roommates", () => {
  it("returns initial roommates", () => {
    expect(getRoommates().length).toBe(3);
  });

  it("adds a roommate", () => {
    addRoommate({ name: "Taylor", email: "taylor@example.com" });
    expect(getRoommates().length).toBe(4);
  });

  it("removes a roommate", () => {
    removeRoommate("r1");
    expect(getRoommates().length).toBe(2);
  });

  it("returns false for unknown id", () => {
    expect(removeRoommate("xxx")).toBe(false);
  });
});

describe("store - expenses", () => {
  it("returns initial expenses", () => {
    expect(getExpenses().length).toBe(2);
  });

  it("adds an expense", () => {
    addExpense({ description: "Pizza", amount: 40, payerId: "r1", splitWith: ["r1", "r2"], date: "2024-06-10", category: "food" });
    expect(getExpenses().length).toBe(3);
  });

  it("expense has correct data", () => {
    const e = addExpense({ description: "Beer", amount: 20, payerId: "r2", splitWith: ["r1", "r2", "r3"], date: "2024-06-11", category: "drinks" });
    expect(e.payerId).toBe("r2");
    expect(e.amount).toBe(20);
  });
});

describe("store - settlements", () => {
  it("starts with empty settlements", () => {
    expect(getSettlements().length).toBe(0);
  });

  it("adds a settlement", () => {
    addSettlement({ fromId: "r2", toId: "r1", amount: 30, date: "2024-06-15" });
    expect(getSettlements().length).toBe(1);
  });
});
