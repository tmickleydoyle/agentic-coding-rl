import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/savings/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Savings API", () => {
  it("GET returns goals", async () => {
    const req = new Request("http://localhost/api/savings");
    const res = await GET(req);
    const data = await res.json();
    expect(data.data.length).toBe(2);
  });
  it("GET returns contributions", async () => {
    const req = new Request("http://localhost/api/savings?type=contributions");
    const res = await GET(req);
    const data = await res.json();
    expect(data.data.length).toBe(3);
  });
  it("POST adds goal", async () => {
    const req = new Request("http://localhost/api/savings", {
      method: "POST",
      body: JSON.stringify({ id: "g99", name: "Test", target: 1000, deadline: "2025-01-01" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
  it("DELETE removes goal", async () => {
    const req = new Request("http://localhost/api/savings?id=g1", { method: "DELETE" });
    await DELETE(req);
    const req2 = new Request("http://localhost/api/savings");
    const res2 = await GET(req2);
    const data = await res2.json();
    expect(data.data.length).toBe(1);
  });
});
