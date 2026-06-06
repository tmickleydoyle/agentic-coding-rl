import { describe, it, expect, beforeEach } from "vitest";
import { getCredentials, addCredential, removeCredential, getWeakCredentials, getSettings, updateSettings, generatePassword, __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("store - credentials", () => {
  it("returns initial credentials", () => {
    expect(getCredentials().length).toBe(2);
  });

  it("adds a credential", () => {
    addCredential({ site: "Twitter", username: "alice", password: "tw_secure_2024!", url: "https://twitter.com", category: "social", notes: "", createdAt: "2024-03-01" });
    expect(getCredentials().length).toBe(3);
  });

  it("removes a credential", () => {
    removeCredential("c1");
    expect(getCredentials().length).toBe(1);
  });

  it("returns false for unknown id", () => {
    expect(removeCredential("xxx")).toBe(false);
  });
});

describe("store - audit", () => {
  it("returns weak credentials", () => {
    const weak = getWeakCredentials();
    expect(weak.length).toBe(1);
    expect(weak[0].site).toBe("Netflix");
  });

  it("no weak after removing short one", () => {
    removeCredential("c2");
    expect(getWeakCredentials().length).toBe(0);
  });
});

describe("store - settings", () => {
  it("returns default settings", () => {
    const s = getSettings();
    expect(s.autoLockMinutes).toBe(5);
    expect(s.requireSymbols).toBe(true);
  });

  it("updates settings", () => {
    updateSettings({ autoLockMinutes: 10 });
    expect(getSettings().autoLockMinutes).toBe(10);
  });
});

describe("generatePassword", () => {
  it("generates password of correct length", () => {
    const pw = generatePassword(20, false);
    expect(pw.length).toBe(20);
  });

  it("generates different passwords each time", () => {
    const p1 = generatePassword(16, true);
    const p2 = generatePassword(16, true);
    expect(typeof p1).toBe("string");
    expect(typeof p2).toBe("string");
  });
});
