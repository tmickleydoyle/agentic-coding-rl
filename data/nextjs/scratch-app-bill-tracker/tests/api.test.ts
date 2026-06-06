import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE, PATCH } from "../app/api/bills/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Bills API", () => {
  it("GET returns all bills", async () => {
    const data = await (await GET(new Request("http://localhost/api/bills"))).json();
    expect(data.data.length).toBe(4);
  });
  it("POST adds bill", async () => {
    const res = await POST(new Request("http://localhost/api/bills", {
      method: "POST",
      body: JSON.stringify({ id: "b99", name: "Test", amount: 30, dueDay: 10, category: "other", isActive: true }),
    }));
    expect(res.status).toBe(201);
  });
  it("PATCH toggles bill", async () => {
    await PATCH(new Request("http://localhost/api/bills?id=b4", { method: "PATCH" }));
    const data = await (await GET(new Request("http://localhost/api/bills"))).json();
    const b4 = data.data.find((b: {id: string}) => b.id === "b4");
    expect(b4.isActive).toBe(true);
  });
  it("DELETE removes bill", async () => {
    await DELETE(new Request("http://localhost/api/bills?id=b1", { method: "DELETE" }));
    const data = await (await GET(new Request("http://localhost/api/bills"))).json();
    expect(data.data.length).toBe(3);
  });
});
