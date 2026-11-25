import { describe, expect, it } from "vitest";
import { calculateDeadline, nextBusinessDay } from "@/lib/calculate-deadlines";
import { deadlineConfig } from "@/config/analysis";
import type { LetterDeadline } from "@/lib/letter-schema";

const relative: LetterDeadline = { id: "frist-1", typ: "relativ", datum: null, original_zitat: "innerhalb eines Monats nach Bekanntgabe", dauer: 1, einheit: "monate", bezug: "bekanntgabe" };
const options = { letterDate: "2026-11-23", arrivalDate: "2026-11-25", delivery: "post" as const };
describe("Fristberechnung", () => {
  it("verwendet vier konfigurierbare Tage für die Bekanntgabe", () => {
    expect(deadlineConfig.postalNoticeDays).toBe(4);
    expect(calculateDeadline(relative, options).date).toBe("2026-12-28");
  });
  it("berechnet Monatsfristen nach §188 auch am Monatsende", () => {
    expect(calculateDeadline({ ...relative, bezug: "briefdatum" }, { ...options, letterDate: "2026-01-31" }).date).toBe("2026-03-02");
  });
  it("addiert Wochen vom Ereignistag gemäß §§187/188", () => {
    expect(calculateDeadline({ ...relative, einheit: "wochen", dauer: 2, bezug: "zugang" }, options).date).toBe("2026-12-09");
  });
  it("verschiebt Samstage und Sonntage auf den nächsten Werktag", () => {
    expect(nextBusinessDay("2026-11-28")).toBe("2026-11-30");
    expect(nextBusinessDay("2026-11-29")).toBe("2026-11-30");
  });
  it("berücksichtigt bundesweite auch bewegliche Feiertage", () => {
    expect(nextBusinessDay("2026-12-25")).toBe("2026-12-28");
    expect(nextBusinessDay("2026-04-03")).toBe("2026-04-07");
    expect(nextBusinessDay("2026-05-14")).toBe("2026-05-15");
  });
  it("verwendet bei fehlendem Briefdatum das Ankunftsdatum mit Warnung", () => {
    const deadline = calculateDeadline(relative, { ...options, letterDate: null });
    expect(deadline.date).toBe("2026-12-28");
    expect(deadline.uncertain).toBe(true);
  });
  it("warnt bei unklarer Zustellart", () => {
    expect(calculateDeadline(relative, { ...options, delivery: "unklar" }).uncertain).toBe(true);
  });
  it("berechnet relative Fristen nach Briefdatum-Korrektur neu", () => {
    expect(calculateDeadline(relative, options).date).toBe("2026-12-28");
    expect(calculateDeadline(relative, { ...options, letterDate: "2026-11-24" }).date).toBe("2026-12-28");
    expect(calculateDeadline(relative, { ...options, letterDate: "2026-11-25" }).date).toBe("2026-12-29");
  });
  it("lässt feste Daten bei Briefdatum-Korrektur unverändert", () => {
    const fixed: LetterDeadline = { ...relative, typ: "fest", datum: "2026-12-02", dauer: null, einheit: null, bezug: null };
    expect(calculateDeadline(fixed, options).date).toBe("2026-12-02");
    expect(calculateDeadline(fixed, { ...options, letterDate: "2026-11-25" }).date).toBe("2026-12-02");
  });
  it("empfiehlt sieben Tage vor dem Enddatum", () => {
    expect(calculateDeadline(relative, options).recommendation).toBe("2026-12-21");
  });
});