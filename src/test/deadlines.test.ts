import { describe, expect, it } from "vitest";
import { deadlineTone, daysUntil, recommendedDate } from "@/lib/deadlines";

describe("Fristenanzeige", () => {
  it("ist rot bei weniger als sieben Tagen", () => {
    expect(deadlineTone(6)).toBe("urgent");
    expect(deadlineTone(-1)).toBe("urgent");
  });
  it("ist gelb ab sieben und unter vierzehn Tagen", () => {
    expect(deadlineTone(7)).toBe("soon");
    expect(deadlineTone(13)).toBe("soon");
  });
  it("ist grün ab vierzehn Tagen", () => {
    expect(deadlineTone(14)).toBe("safe");
  });
  it("empfiehlt die Erledigung sieben Tage vor dem Fristende", () => {
    expect(recommendedDate("2026-12-02")).toBe("2026-11-25");
  });
  it("vergleicht Kalendertage unabhängig von der Uhrzeit", () => {
    expect(daysUntil("2026-12-02", new Date(2026, 10, 25, 23, 59))).toBe(7);
  });
});