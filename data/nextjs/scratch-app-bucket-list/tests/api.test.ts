import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH, DELETE } from "../app/api/bucketlist/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Bucket List API", () => {
  it("GET returns goals", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
  it("POST adds a goal", async () => {
    const req = new Request("http://localhost/api/bucketlist", {
      method: "POST",
      body: JSON.stringify({ title: "New Goal", description: "Do it", category: "Travel", targetDate: "2025-01-01", difficulty: "hard" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("New Goal");
    expect(data.completed).toBe(false);
  });
  it("PATCH marks goal completed", async () => {
    const req = new Request("http://localhost/api/bucketlist", {
      method: "PATCH",
      body: JSON.stringify({ id: "1", completed: true }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.completed).toBe(true);
    expect(data.completedAt).toBeTruthy();
  });
  it("DELETE removes goal", async () => {
    const req = new Request("http://localhost/api/bucketlist", { method: "DELETE", body: JSON.stringify({ id: "1" }) });
    await DELETE(req);
    const listRes = await GET();
    const list = await listRes.json();
    expect(list.find((g: { id: string }) => g.id === "1")).toBeUndefined();
  });
  it("PATCH returns 404 for unknown id", async () => {
    const req = new Request("http://localhost/api/bucketlist", {
      method: "PATCH",
      body: JSON.stringify({ id: "999", completed: true }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(404);
  });
});
