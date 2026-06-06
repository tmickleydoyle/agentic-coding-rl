import { describe, it, expect, beforeEach } from "vitest";
import { getFolders, addFolder, removeFolder, getDocuments, addDocument, removeDocument, toggleShared, searchDocuments, __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("store - folders", () => {
  it("returns initial folders", () => {
    expect(getFolders().length).toBe(2);
  });

  it("adds a folder", () => {
    addFolder({ name: "Projects", color: "red" });
    expect(getFolders().length).toBe(3);
  });

  it("removes a folder", () => {
    removeFolder("f1");
    expect(getFolders().length).toBe(1);
  });

  it("returns false for unknown folder", () => {
    expect(removeFolder("xxx")).toBe(false);
  });
});

describe("store - documents", () => {
  it("returns initial documents", () => {
    expect(getDocuments().length).toBe(2);
  });

  it("adds a document", () => {
    addDocument({ title: "Contract", description: "New contract", url: "https://x.com/c.pdf", folderId: "f1", tags: ["legal"], shared: false, createdAt: "2024-07-01" });
    expect(getDocuments().length).toBe(3);
  });

  it("removes a document", () => {
    removeDocument("d1");
    expect(getDocuments().length).toBe(1);
  });

  it("toggles shared status", () => {
    const d = toggleShared("d1");
    expect(d).not.toBeNull();
    expect(d!.shared).toBe(true);
  });

  it("returns null for unknown doc toggle", () => {
    expect(toggleShared("xxx")).toBeNull();
  });
});

describe("store - search", () => {
  it("searches by title", () => {
    const results = searchDocuments("Q2");
    expect(results.length).toBe(1);
    expect(results[0].title).toBe("Q2 Report");
  });

  it("searches by tag", () => {
    const results = searchDocuments("legal");
    expect(results.length).toBe(1);
  });

  it("returns empty for no match", () => {
    expect(searchDocuments("zzznomatch")).toHaveLength(0);
  });
});
