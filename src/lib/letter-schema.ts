import { z } from "zod";

export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "Ungültiges Datum");

const text = z.string().max(12000);
const pair = { de: text, ziel: text };
export const deadlineSchema = z.object({
  id: z.string().min(1).max(80), typ: z.enum(["fest", "relativ"]), datum: isoDate.nullable(),
  original_zitat: text, dauer: z.number().int().min(1).max(1200).nullable(),
  einheit: z.enum(["tage", "wochen", "monate", "jahre"]).nullable(),
  bezug: z.enum(["bekanntgabe", "zugang", "briefdatum"]).nullable(),
});
export const letterSchema = z.object({
  absender: text, absender_ziel: text, briefart: text, briefart_ziel: text,
  briefdatum: isoDate.nullable(), aktenzeichen_vorhanden: z.boolean(),
  zustellart: z.enum(["post", "andere", "unklar"]), lesbarkeit: z.enum(["gut", "mittel", "schlecht"]),
  zusammenfassung_de: text, zusammenfassung_ziel: text,
  todos: z.array(z.object({ text_de: text, text_ziel: text, frist_id: z.string().nullable(), symbol: z.enum(["dokument", "senden", "termin", "euro", "telefon", "pruefen"]) })).max(60),
  fristen: z.array(deadlineSchema).max(40),
  termine: z.array(z.object({ datum: isoDate.nullable(), uhrzeit: z.string().regex(/^\d{2}:\d{2}$/).nullable(), ort: text, zweck_de: text, zweck_ziel: text })).max(40),
  unterlagen: z.array(z.object(pair)).max(60), warnungen: z.array(z.object(pair)).max(60),
  unsicherheiten: z.array(text).max(40), unsicherheiten_ziel: z.array(text).max(40), rechtsbehelf_vorhanden: z.boolean(),
}).superRefine((letter, context) => {
  const ids = new Set<string>();
  letter.fristen.forEach((deadline, index) => {
    if (ids.has(deadline.id)) context.addIssue({ code: "custom", path: ["fristen", index, "id"], message: "Doppelte Frist" });
    ids.add(deadline.id);
    if (deadline.typ === "fest" && !deadline.datum) context.addIssue({ code: "custom", path: ["fristen", index], message: "Feste Frist ohne Datum" });
  });
  letter.todos.forEach((todo, index) => {
    if (todo.frist_id !== null && !ids.has(todo.frist_id)) context.addIssue({ code: "custom", path: ["todos", index, "frist_id"], message: "Unbekannte Frist" });
  });
});
export type Letter = z.infer<typeof letterSchema>;
export type LetterDeadline = z.infer<typeof deadlineSchema>;

// Strip target-language fields for an exact comparison of all facts.
export function factsOnly(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(factsOnly);
  if (value !== null && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "ziel" && !key.endsWith("_ziel")).map(([key, item]) => [key, factsOnly(item)]));
  return value;
}

function numericTokens(value: string): string[] {
  return (value.match(/\d+(?:[.,:/-]\d+)*/g) ?? []).sort();
}

export function acceptTranslation(original: Letter, candidate: unknown): Letter {
  const translated = letterSchema.parse(candidate);
  if (JSON.stringify(factsOnly(original)) !== JSON.stringify(factsOnly(translated))) throw new Error("Übersetzung hat Fakten verändert");
  const pairs = [
    [original.absender, translated.absender_ziel], [original.briefart, translated.briefart_ziel],
    [original.zusammenfassung_de, translated.zusammenfassung_ziel],
    ...original.todos.map((todo, index) => [todo.text_de, translated.todos[index]?.text_ziel ?? ""]),
    ...original.termine.map((item, index) => [item.zweck_de, translated.termine[index]?.zweck_ziel ?? ""]),
    ...original.unterlagen.map((item, index) => [item.de, translated.unterlagen[index]?.ziel ?? ""]),
    ...original.warnungen.map((item, index) => [item.de, translated.warnungen[index]?.ziel ?? ""]),
    ...original.unsicherheiten.map((item, index) => [item, translated.unsicherheiten_ziel[index] ?? ""]),
  ];
  for (const [source, target] of pairs) {
    if (source === undefined || target === undefined || (source.trim() && !target.trim()) || JSON.stringify(numericTokens(source)) !== JSON.stringify(numericTokens(target))) throw new Error("Übersetzung unvollständig oder Zahlen verändert");
  }
  return translated;
}