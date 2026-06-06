import { describe, it, expect, beforeEach } from "vitest";
import { getUtilities, addUtility, removeUtility, getBills, addBill, markBillPaid, getReadings, addReading, __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("store - utilities", () => {
  it("returns initial utilities", () => {
    expect(getUtilities().length).toBe(2);
  });

  it("adds a utility", () => {
    addUtility({ name: "Gas Co", type: "gas", provider: "Gas Provider", accountNumber: "GC-001" });
    expect(getUtilities().length).toBe(3);
  });

  it("removes a utility", () => {
    removeUtility("u1");
    expect(getUtilities().length).toBe(1);
  });

  it("returns false for unknown id", () => {
    expect(removeUtility("xxx")).toBe(false);
  });
});

describe("store - bills", () => {
  it("returns initial bills", () => {
    expect(getBills().length).toBe(2);
  });

  it("adds a bill", () => {
    addBill({ utilityId: "u1", month: "2024-07", amount: 90, dueDate: "2024-07-20", paid: false });
    expect(getBills().length).toBe(3);
  });

  it("marks bill paid", () => {
    const result = markBillPaid("b2");
    expect(result).not.toBeNull();
    expect(result!.paid).toBe(true);
  });

  it("returns null for unknown bill", () => {
    expect(markBillPaid("xxx")).toBeNull();
  });
});

describe("store - readings", () => {
  it("returns initial readings", () => {
    expect(getReadings().length).toBe(1);
  });

  it("adds a reading", () => {
    addReading({ utilityId: "u1", month: "2024-07", units: 500, reading: 15700 });
    expect(getReadings().length).toBe(2);
  });
});
