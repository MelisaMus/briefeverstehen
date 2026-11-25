import { describe, it, expect } from "vitest";
import { letterSchema } from "@/lib/letter-schema";
import { urgentAdvice, matchingAdviceServices, preparedAdvice, type AdviceService } from "@/lib/urgent-advice";
import { calculateDeadline, type CalculatedDeadline } from "@/lib/calculate-deadlines";
import { adviceReasons } from "@/config/urgent-advice";
import { sampleLetter } from "./letter-schema.test";

const today = "2026-11-25";
function deadline(date: string | null): CalculatedDeadline { return { id: "f1", date, recommendation: null, uncertain: false, quote: "", relative: false }; }
const residence: AdviceService = { name: "Test: Aufenthalt", thema: ["abschiebung", "ausreise"], adresse: "", telefon: "", oeffnungszeiten: "", link: "" };
const housing: AdviceService = { ...residence, name: "Test: Wohnung", thema: ["raeumung"] };

describe("Dringende Beratung", () => {
  it.each(adviceReasons)("aktiviert bei dringend_beratung für %s ohne Frist", reason => {
    const letter = { ...sampleLetter, dringend_beratung: true, dringend_grund: reason };
    expect(urgentAdvice(letter, [], today)?.reason).toBe(reason);
    expect(letterSchema.safeParse(letter).success).toBe(true);
  });
  it("aktiviert Rechtsbehelf bei 13 Tagen, nicht bei genau 14", () => {
    const letter = { ...sampleLetter, rechtsbehelf_vorhanden: true };
    expect(urgentAdvice(letter, [deadline("2026-12-08")], today)?.reason).toBe("sonstiges");
    expect(urgentAdvice(letter, [deadline("2026-12-09")], today)).toBeNull();
  });
  it("aktiviert nicht allein wegen einer kurzen Frist", () => {
    expect(urgentAdvice(sampleLetter, [deadline("2026-11-26")], today)).toBeNull();
  });
  it("berechnet aus unbekannten Fristen keine Restzeit", () => {
    expect(urgentAdvice({ ...sampleLetter, rechtsbehelf_vorhanden: true }, [deadline(null)], today)).toBeNull();
  });
  it("zeigt auch bei abgelaufener Rechtsbehelfsfrist Hilfe", () => {
    expect(urgentAdvice({ ...sampleLetter, rechtsbehelf_vorhanden: true }, [deadline("2026-11-24")], today)).not.toBeNull();
  });
  it("reagiert auf korrigiertes Briefdatum bei relativer Frist", () => {
    const relative = { id: "f1", typ: "relativ" as const, datum: null, original_zitat: "", dauer: 2, einheit: "wochen" as const, bezug: "briefdatum" as const };
    const letter = { ...sampleLetter, rechtsbehelf_vorhanden: true };
    const calc = (letterDate: string) => calculateDeadline(relative, { letterDate, arrivalDate: today, delivery: "post" });
    expect(urgentAdvice(letter, [calc("2026-11-24")], today)).not.toBeNull();
    expect(urgentAdvice(letter, [calc("2026-11-25")], today)).toBeNull();
  });
  it("verlangt Grund bei true und null bei false", () => {
    expect(letterSchema.safeParse({ ...sampleLetter, dringend_beratung: true, dringend_grund: null }).success).toBe(false);
    expect(letterSchema.safeParse({ ...sampleLetter, dringend_grund: "gericht" }).success).toBe(false);
    expect(letterSchema.safeParse({ ...sampleLetter, dringend_beratung: true, dringend_grund: "frei erfunden" }).success).toBe(false);
  });
  it("filtert Beratungsstellen nach Grund und bei Fall b nicht nach Thema", () => {
    expect(matchingAdviceServices("ausreise", false, [residence, housing])).toEqual([residence]);
    expect(matchingAdviceServices("sonstiges", true, [residence, housing])).toEqual([residence, housing]);
  });
  it("behandelt leere Datei und Platzhalter nicht als echte Empfehlungen", () => {
    expect(matchingAdviceServices("sonstiges", true, [])).toEqual([]);
    expect(matchingAdviceServices("sonstiges", true)).toEqual([]);
  });
  it("bereitet auch für später korrigierte Fristen eine Übersetzung vor", () => {
    const prepared = preparedAdvice(sampleLetter);
    expect(prepared.dringend_hinweis_de.length).toBeGreaterThan(0);
    expect(prepared.dringend_hinweis_ziel).toBe("");
    expect(prepared.dringend_beratung).toBe(false);
  });
});