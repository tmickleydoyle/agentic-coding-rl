import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH, DELETE } from "../app/api/tracks/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Tracks API", () => {
  it("GET returns albums", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
  it("POST adds an album", async () => {
    const req = new Request("http://localhost/api/tracks", {
      method: "POST",
      body: JSON.stringify({ title: "Test Album", artist: "Artist", genre: "Jazz", year: 2020, tracks: 10 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Test Album");
    expect(data.ownership).toBe("want");
  });
  it("PATCH updates ownership", async () => {
    const req = new Request("http://localhost/api/tracks", {
      method: "PATCH",
      body: JSON.stringify({ id: "1", ownership: "owned" }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.ownership).toBe("owned");
  });
  it("DELETE removes album", async () => {
    const req = new Request("http://localhost/api/tracks", { method: "DELETE", body: JSON.stringify({ id: "1" }) });
    await DELETE(req);
    const listRes = await GET();
    const list = await listRes.json();
    expect(list.find((a: { id: string }) => a.id === "1")).toBeUndefined();
  });
});
