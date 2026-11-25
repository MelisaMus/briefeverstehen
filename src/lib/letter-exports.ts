import type { Letter } from "./letter-schema";
import type { CalculatedDeadline } from "./calculate-deadlines";
import { formatDate } from "./deadlines";
import { urgentAdvice } from "./urgent-advice";

export const aiNotice = "Erstellt mit KI. Fehler sind möglich. Wichtige Fristen bitte immer im Original prüfen.";
export const legalNotice = "Diese App erklärt Briefe. Sie ersetzt keine Rechtsberatung. Bei Widerspruch, Klage oder Aufenthaltsfragen: Beratungsstelle kontaktieren.";

export function buildExportText(letter: Letter, target: Letter | null, letterDate: string, deadlines: CalculatedDeadline[], today = new Date().toISOString().slice(0, 10)): string {
  const advice = urgentAdvice(letter, deadlines, today);
  return [advice?.german, advice ? target?.dringend_hinweis_ziel : "", ...advice?.services.flatMap(service => [service.name, service.adresse, service.telefon, service.email, service.oeffnungszeiten, service.link, service.hinweis]) ?? [], "Brief verstehen", `Von wem? ${letter.absender}`, target?.absender_ziel,
    `Briefdatum laut Brief: ${letterDate ? formatDate(letterDate) : "nicht erkannt"}`,
    letter.briefart, target?.briefart_ziel, "Worum geht es?", letter.zusammenfassung_de, target?.zusammenfassung_ziel,
    "Was musst du tun?", ...letter.todos.flatMap((item, index) => [item.text_de, target?.todos[index]?.text_ziel]),
    "Bis wann?", ...deadlines.map((item) => [`Spätestens: ${item.date ? formatDate(item.date) : "nicht bestimmbar"}`, item.recommendation ? `Empfehlung: bis ${formatDate(item.recommendation)} erledigen` : "", item.uncertain ? "Frist bitte selbst prüfen" : "", `So steht es im Brief: ${item.quote}`].filter(Boolean).join("\n")),
    "Was brauchst du?", ...letter.unterlagen.flatMap((item, index) => [item.de, target?.unterlagen[index]?.ziel]),
    "Termine", ...letter.termine.flatMap((item, index) => [`${item.datum ? formatDate(item.datum) : "Datum unklar"} ${item.uhrzeit ?? ""} ${item.ort}`, item.zweck_de, target?.termine[index]?.zweck_ziel]),
    "Wichtig / Achtung", ...letter.warnungen.flatMap((item, index) => [item.de, target?.warnungen[index]?.ziel]),
    ...letter.unsicherheiten, ...target?.unsicherheiten_ziel ?? [], aiNotice, legalNotice,
  ].filter(Boolean).join("\n\n");
}

function escapeIcs(value: string): string { return value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(";", "\\;").replaceAll(",", "\\,"); }
function foldLine(line: string): string {
  const encoder = new TextEncoder(); let output = ""; let bytes = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 74) { output += "\r\n "; bytes = 1; }
    output += character; bytes += size;
  }
  return output;
}

export function buildCalendar(letter: Letter, deadlines: CalculatedDeadline[]): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Brief verstehen//DE", "CALSCALE:GREGORIAN"];
  const addEvent = (date: string, title: string, description: string, time?: string | null, location?: string) => {
    lines.push("BEGIN:VEVENT", `UID:${crypto.randomUUID()}@brief-verstehen`, `DTSTAMP:${stamp}`,
      time ? `DTSTART:${date.replaceAll("-", "")}T${time.replace(":", "")}00` : `DTSTART;VALUE=DATE:${date.replaceAll("-", "")}`,
      `SUMMARY:${escapeIcs(title)}`, `DESCRIPTION:${escapeIcs(description)}`);
    if (location) lines.push(`LOCATION:${escapeIcs(location)}`);
    lines.push("END:VEVENT");
  };
  deadlines.forEach((deadline) => {
    if (deadline.date) addEvent(deadline.date, `${letter.absender}: Frist${deadline.uncertain ? " (bitte prüfen)" : ""}`, `${deadline.quote}\n${deadline.recommendation ? `Empfehlung: bis ${deadline.recommendation} erledigen.\n` : ""}${aiNotice}`);
  });
  letter.termine.forEach((item) => { if (item.datum) addEvent(item.datum, `${letter.absender}: ${item.zweck_de}`, aiNotice, item.uhrzeit, item.ort); });
  lines.push("END:VCALENDAR", "");
  return lines.map(foldLine).join("\r\n");
}

export function downloadFile(contents: string, type: string, name: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}