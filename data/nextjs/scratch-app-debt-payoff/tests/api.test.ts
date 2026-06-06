import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/debts/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Debts API", () => {
  it("GET returns debts", async () => {
    const req = new Request("http://localhost/api/debts");
    const res = await GET(req);
    const data = await res.json();
    expect(data.data.length).toBe(3);
  });
  it("GET returns payments", async () => {
    const req = new Request("http://localhost/api/debts?type=payments");
    const res = await GET(req);
    const data = await res.json();
    expect(data.data.length).toBe(2);
  });
  it("POST adds debt", async () => {
    const req = new Request("http://localhost/api/debts", {
      method: "POST",
      body: JSON.stringify({ id: "d99", name: "Test", balance: 1000, interestRate: 10, minimumPayment: 30 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
  it("DELETE removes debt", async () => {
    const req = new Request("http://localhost/api/debts?id=d1", { method: "DELETE" });
    await DELETE(req);
    const req2 = new Request("http://localhost/api/debts");
    const data = await (await GET(req2)).json();
    expect(data.data.length).toBe(2);
  });
});
