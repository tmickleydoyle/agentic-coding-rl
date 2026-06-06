import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getInjuries, addInjury, addTreatment, addNote } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Store API", () => {
  it("returns 2 seed injuries", () => {
    expect(getInjuries().length).toBe(2);
  });

  it("adds an injury", () => {
    addInjury("Left Hip", "bruise", "mild", "2024-04-01");
    expect(getInjuries().length).toBe(3);
  });

  it("rejects empty body part", () => {
    expect(addInjury("", "strain", "mild", "2024-04-01")).toBeNull();
  });

  it("adds treatment", () => {
    addTreatment("i1", "physio", "2024-03-11", 45);
    const i = getInjuries().find((i) => i.id === "i1");
    expect(i!.treatments.length).toBe(2);
  });

  it("rejects treatment with zero duration", () => {
    expect(addTreatment("i1", "ice", "2024-03-11", 0)).toBeNull();
  });

  it("adds note", () => {
    addNote("i1", "Recovering well", "2024-03-12");
    const i = getInjuries().find((i) => i.id === "i1");
    expect(i!.notes.length).toBe(1);
  });
});
