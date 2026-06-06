import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH, DELETE } from "../app/api/goals/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Goals API", () => {
  it("GET returns all goals", async () => {
    const data = await (await GET(new Request("http://localhost/api/goals"))).json();
    expect(data.data.length).toBe(4);
  });
  it("POST adds goal", async () => {
    const res = await POST(new Request("http://localhost/api/goals", {
      method: "POST",
      body: JSON.stringify({ id: "fg99", title: "Test", targetAmount: 5000, savedAmount: 0, category: "other", status: "active" }),
    }));
    expect(res.status).toBe(201);
  });
  it("PATCH updates saved amount", async () => {
    await PATCH(new Request("http://localhost/api/goals?id=fg1", {
      method: "PATCH",
      body: JSON.stringify({ savedAmount: 12000 }),
    }));
    const data = await (await GET(new Request("http://localhost/api/goals"))).json();
    const fg1 = data.data.find((g: {id: string}) => g.id === "fg1");
    expect(fg1.savedAmount).toBe(12000);
  });
  it("DELETE removes goal", async () => {
    await DELETE(new Request("http://localhost/api/goals?id=fg1", { method: "DELETE" }));
    const data = await (await GET(new Request("http://localhost/api/goals"))).json();
    expect(data.data.length).toBe(3);
  });
});
