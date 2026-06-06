import { describe, it, expect, beforeEach } from "vitest";
import { getRecipients, addRecipient, removeRecipient, getOccasions, addOccasion, removeOccasion, getGifts, addGift, removeGift, updateGiftStatus, __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("store - recipients", () => {
  it("returns initial recipients", () => {
    expect(getRecipients().length).toBe(2);
  });

  it("adds a recipient", () => {
    addRecipient({ name: "Sister", relation: "sibling" });
    expect(getRecipients().length).toBe(3);
  });

  it("removes a recipient", () => {
    removeRecipient("rc1");
    expect(getRecipients().length).toBe(1);
  });
});

describe("store - occasions", () => {
  it("returns initial occasions", () => {
    expect(getOccasions().length).toBe(2);
  });

  it("adds an occasion", () => {
    addOccasion({ name: "Anniversary", date: "2024-09-01", type: "anniversary", recipientId: "rc1" });
    expect(getOccasions().length).toBe(3);
  });

  it("removes an occasion", () => {
    removeOccasion("oc1");
    expect(getOccasions().length).toBe(1);
  });
});

describe("store - gifts", () => {
  it("returns initial gifts", () => {
    expect(getGifts().length).toBe(3);
  });

  it("adds a gift", () => {
    addGift({ title: "Mug", description: "Coffee mug", price: 15, occasionId: "oc1", recipientId: "rc1", status: "idea" });
    expect(getGifts().length).toBe(4);
  });

  it("removes a gift", () => {
    removeGift("gi1");
    expect(getGifts().length).toBe(2);
  });

  it("updates gift status", () => {
    const g = updateGiftStatus("gi2", "purchased");
    expect(g).not.toBeNull();
    expect(g!.status).toBe("purchased");
  });

  it("returns null for unknown gift", () => {
    expect(updateGiftStatus("xxx", "given")).toBeNull();
  });
});
