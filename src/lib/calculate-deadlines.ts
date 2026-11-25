import Holidays from "date-holidays";
import { addDays, addMonths, addYears } from "date-fns";
import { deadlineConfig } from "@/config/analysis";
import type { LetterDeadline } from "./letter-schema";

function dateObject(date: string): Date { return new Date(`${date}T12:00:00Z`); }
function iso(date: Date): string { return date.toISOString().slice(0, 10); }

export function nextBusinessDay(date: string): string {
  const holidays = new Holidays("DE", { types: ["public"] });
  let day = dateObject(date);
  for (let count = 0; count < 30; count++) {
    const holiday = holidays.getHolidays(day.getUTCFullYear()).some((item) => item.type === "public" && item.date.slice(0, 10) === iso(day));
    if (day.getUTCDay() !== 0 && day.getUTCDay() !== 6 && !holiday) return iso(day);
    day = addDays(day, 1);
  }
  return iso(day);
}

export type CalculatedDeadline = { id: string; date: string | null; recommendation: string | null; uncertain: boolean; quote: string; relative: boolean };
export function calculateDeadline(deadline: LetterDeadline, options: { letterDate: string | null; arrivalDate: string; delivery: "post" | "andere" | "unklar" }): CalculatedDeadline {
  const result: CalculatedDeadline = { id: deadline.id, date: null, recommendation: null, uncertain: false, quote: deadline.original_zitat, relative: deadline.typ === "relativ" };
  if (deadline.typ === "fest") {
    result.date = deadline.datum;
  } else {
    result.uncertain = !options.letterDate || options.delivery === "unklar";
    if (deadline.dauer === null || deadline.einheit === null || deadline.bezug === null) return { ...result, uncertain: true };
    let base = options.letterDate ?? options.arrivalDate;
    if (deadline.bezug === "zugang") base = options.arrivalDate;
    if (deadline.bezug === "bekanntgabe") {
      if (options.delivery === "post" && options.letterDate) {
        base = iso(addDays(dateObject(options.letterDate), deadlineConfig.postalNoticeDays));
        // A proven later arrival overrides the postal presumption.
        if (options.arrivalDate > base) { base = options.arrivalDate; result.uncertain = true; }
      } else { base = options.arrivalDate; result.uncertain = true; }
    }
    const start = dateObject(base);
    const end = deadline.einheit === "monate" ? addMonths(start, deadline.dauer) : deadline.einheit === "jahre" ? addYears(start, deadline.dauer) : addDays(start, deadline.dauer * (deadline.einheit === "wochen" ? 7 : 1));
    result.date = nextBusinessDay(iso(end));
  }
  if (result.date) result.recommendation = iso(addDays(dateObject(result.date), -7));
  return result;
}