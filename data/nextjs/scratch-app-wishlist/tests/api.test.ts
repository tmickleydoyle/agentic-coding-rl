import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH, DELETE } from "../app/api/wishlist/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Wishlist API", () => {
  it("GET returns items", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
  it("POST adds an item", async () => {
    const req = new Request("http://localhost/api/wishlist", {
      method: "POST",
      body: JSON.stringify({ name: "New Item", price: 99, url: "", category: "Tech", priority: "high" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("New Item");
    expect(data.purchased).toBe(false);
  });
  it("PATCH marks item purchased", async () => {
    const req = new Request("http://localhost/api/wishlist", {
      method: "PATCH",
      body: JSON.stringify({ id: "1", purchased: true }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.purchased).toBe(true);
  });
  it("DELETE removes item", async () => {
    const req = new Request("http://localhost/api/wishlist", { method: "DELETE", body: JSON.stringify({ id: "1" }) });
    await DELETE(req);
    const listRes = await GET();
    const list = await listRes.json();
    expect(list.find((i: { id: string }) => i.id === "1")).toBeUndefined();
  });
});
