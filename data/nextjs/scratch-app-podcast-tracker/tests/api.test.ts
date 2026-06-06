import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH, DELETE } from "../app/api/podcasts/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Podcasts API", () => {
  it("GET returns podcasts", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
  it("POST adds a podcast", async () => {
    const req = new Request("http://localhost/api/podcasts", {
      method: "POST",
      body: JSON.stringify({ title: "New Pod", host: "Host", category: "Science", description: "Sci pod" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("New Pod");
    expect(data.episodes).toEqual([]);
  });
  it("PATCH marks episode played", async () => {
    const req = new Request("http://localhost/api/podcasts", {
      method: "PATCH",
      body: JSON.stringify({ episodeId: "e2", played: true }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.played).toBe(true);
  });
  it("DELETE removes podcast", async () => {
    const req = new Request("http://localhost/api/podcasts", { method: "DELETE", body: JSON.stringify({ id: "1" }) });
    await DELETE(req);
    const listRes = await GET();
    const list = await listRes.json();
    expect(list.find((p: { id: string }) => p.id === "1")).toBeUndefined();
  });
});
