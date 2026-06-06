import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/budget/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Budget API", () => {
  it("GET returns expenses by default", async () => {
    const req = new Request("http://localhost/api/budget");
    const res = await GET(req);
    const data = await res.json();
    expect(data.data.length).toBe(3);
  });

  it("GET returns incomes with type=income", async () => {
    const req = new Request("http://localhost/api/budget?type=income");
    const res = await GET(req);
    const data = await res.json();
    expect(data.data.length).toBe(2);
  });

  it("POST adds expense", async () => {
    const req = new Request("http://localhost/api/budget", {
      method: "POST",
      body: JSON.stringify({ id: "e99", description: "Test", amount: 50, category: "other", date: "2024-02-01" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const req2 = new Request("http://localhost/api/budget");
    const res2 = await GET(req2);
    const data = await res2.json();
    expect(data.data.length).toBe(4);
  });

  it("DELETE removes expense", async () => {
    const req = new Request("http://localhost/api/budget?id=e1", { method: "DELETE" });
    await DELETE(req);
    const req2 = new Request("http://localhost/api/budget");
    const res2 = await GET(req2);
    const data = await res2.json();
    expect(data.data.length).toBe(2);
  });
});
