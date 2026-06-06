import { describe, it, expect, beforeEach } from "vitest";
import { getPolicies, addPolicy, removePolicy, getClaims, addClaim, updateClaimStatus, getDocuments, addDocument, getContacts, addContact, removeContact, __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("store - policies", () => {
  it("returns initial policies", () => {
    expect(getPolicies().length).toBe(2);
  });

  it("adds a policy", () => {
    addPolicy({ name: "Life", type: "life", provider: "LifeCo", policyNumber: "LC-1", premium: 200, startDate: "2024-01-01", endDate: "2025-01-01", active: true });
    expect(getPolicies().length).toBe(3);
  });

  it("removes a policy", () => {
    removePolicy("pol1");
    expect(getPolicies().length).toBe(1);
  });
});

describe("store - claims", () => {
  it("returns initial claims", () => {
    expect(getClaims().length).toBe(1);
  });

  it("adds a claim", () => {
    addClaim({ policyId: "pol1", description: "Water leak", amount: 2000, date: "2024-06-01", status: "open" });
    expect(getClaims().length).toBe(2);
  });

  it("updates claim status", () => {
    const result = updateClaimStatus("cl1", "resolved");
    expect(result).not.toBeNull();
    expect(result!.status).toBe("resolved");
  });

  it("returns null for unknown claim", () => {
    expect(updateClaimStatus("xxx", "resolved")).toBeNull();
  });
});

describe("store - contacts", () => {
  it("returns initial contacts", () => {
    expect(getContacts().length).toBe(1);
  });

  it("adds a contact", () => {
    addContact({ name: "Bob Broker", company: "DriveRight", phone: "555-5678", email: "bob@dr.com", role: "broker" });
    expect(getContacts().length).toBe(2);
  });

  it("removes a contact", () => {
    removeContact("con1");
    expect(getContacts().length).toBe(0);
  });
});
