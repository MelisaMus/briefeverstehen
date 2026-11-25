import entries from "@/config/beratungsstellen.json";
import { adviceTexts, adviceTitle, adviceBringLetter, adviceFallback, adviceThresholdDays, type AdviceReason } from "@/config/urgent-advice";
import type { Letter } from "./letter-schema";
import type { CalculatedDeadline } from "./calculate-deadlines";

export type AdviceService = { name: string; thema: readonly string[]; adresse: string; telefon: string; oeffnungszeiten: string; link: string };
export function matchingAdviceServices(reason: AdviceReason, all: boolean, services: readonly AdviceService[] = entries): AdviceService[] {
  // The requested template is not a real recommendation or a usable contact.
  return services.filter(service => service.name.trim() && service.name !== "Name der Beratungsstelle" && (all || service.thema.includes(reason)));
}
export function adviceGerman(reason: AdviceReason, services: readonly AdviceService[]): string {
  return [adviceTitle, adviceTexts[reason], adviceBringLetter, services.length ? "" : adviceFallback].filter(Boolean).join("\n\n");
}
export function preparedAdvice(letter: Letter): Letter {
  const reason = letter.dringend_beratung ? letter.dringend_grund ?? "sonstiges" : "sonstiges";
  return { ...letter, dringend_hinweis_de: adviceGerman(reason, matchingAdviceServices(reason, !letter.dringend_beratung)), dringend_hinweis_ziel: "" };
}
export function urgentAdvice(letter: Letter, deadlines: readonly CalculatedDeadline[], today: string) {
  const now = Date.parse(`${today}T12:00:00Z`);
  const shortAppeal = letter.rechtsbehelf_vorhanden && deadlines.some(deadline => deadline.date !== null && (Date.parse(`${deadline.date}T12:00:00Z`) - now) / 86400000 < adviceThresholdDays);
  if (!letter.dringend_beratung && !shortAppeal) return null;
  const reason = letter.dringend_beratung ? letter.dringend_grund ?? "sonstiges" : "sonstiges";
  const services = matchingAdviceServices(reason, shortAppeal);
  return { reason, services, german: adviceGerman(reason, services) };
}