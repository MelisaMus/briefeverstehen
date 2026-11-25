import { describe, expect, it } from "vitest";
import { acceptTranslation, isoDate, letterSchema, type Letter } from "@/lib/letter-schema";

export const sampleLetter: Letter = {
  absender: "Jobcenter", absender_ziel: "", briefart: "Unterlagen", briefart_ziel: "", briefdatum: "2026-11-23",
  aktenzeichen_vorhanden: true, zustellart: "post", lesbarkeit: "gut", zusammenfassung_de: "Bitte sende Kontoauszüge für 3 Monate.", zusammenfassung_ziel: "",
  todos: [{ text_de: "3 Kontoauszüge senden.", text_ziel: "", frist_id: "f1", symbol: "senden" }],
  fristen: [{ id: "f1", typ: "relativ", datum: null, original_zitat: "innerhalb eines Monats nach Bekanntgabe", dauer: 1, einheit: "monate", bezug: "bekanntgabe" }],
  termine: [], unterlagen: [], warnungen: [], unsicherheiten: [], unsicherheiten_ziel: [], rechtsbehelf_vorhanden: false,
};
const translated: Letter = { ...sampleLetter, absender_ziel: "Jobcenter", briefart_ziel: "Documents", zusammenfassung_ziel: "Send bank statements for 3 months.", todos: [{ text_de: "3 Kontoauszüge senden.", text_ziel: "Send 3 bank statements.", frist_id: "f1", symbol: "senden" }] };

describe("Übersetzungsprüfung", () => {
  it("akzeptiert ausgefüllte Zielfelder mit identischen Fakten", () => { expect(acceptTranslation(sampleLetter, translated).briefdatum).toBe("2026-11-23"); });
  it("verhindert veränderte Datumsangaben und Fristdauern", () => {
    expect(() => acceptTranslation(sampleLetter, { ...translated, briefdatum: "2026-11-24" })).toThrow();
    expect(() => acceptTranslation(sampleLetter, { ...translated, fristen: [{ ...translated.fristen[0], dauer: 2 }] })).toThrow();
  });
  it("verhindert veränderte Zahlen in übersetzten Texten", () => { expect(() => acceptTranslation(sampleLetter, { ...translated, zusammenfassung_ziel: "Send bank statements for 4 months." })).toThrow(); });
  it("prüft echte Kalenderdaten statt nur das Format", () => { expect(isoDate.safeParse("2026-02-30").success).toBe(false); });
  it("verhindert Verweise auf unbekannte Fristen", () => { expect(letterSchema.safeParse({ ...sampleLetter, todos: [{ text_de: "Senden", text_ziel: "", frist_id: "unknown", symbol: "senden" }] }).success).toBe(false); });
});