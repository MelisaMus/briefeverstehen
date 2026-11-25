export type DeadlineTone = "urgent" | "soon" | "safe";

export function deadlineTone(daysRemaining: number): DeadlineTone {
  if (daysRemaining < 7) return "urgent";
  if (daysRemaining < 14) return "soon";
  return "safe";
}

export function daysUntil(date: string, today: Date): number {
  const [year, month, day] = date.split("-").map(Number);
  if (year === undefined || month === undefined || day === undefined) return 0;
  const target = Date.UTC(year, month - 1, day);
  const current = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - current) / 86400000);
}

export function recommendedDate(date: string): string {
  const day = new Date(`${date}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() - 7);
  return day.toISOString().slice(0, 10);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00Z`));
}

export function localDateInput(today: Date): string {
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}