import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/deadlines";

export function BriefDateField({ value, original, onChange }: {
  value: string; original: string; onChange: (date: string) => void;
}) {
  return <div className="mt-5 border-t border-border pt-4">
    <label htmlFor="brief-date" className="field-label">Briefdatum laut Brief:</label>
    <Input id="brief-date" type="date" value={value} onChange={(event) => {
      const next = event.target.value;
      if (next && event.target.validity.valid) onChange(next);
    }} required className="h-12 max-w-64 bg-card text-base" aria-describedby="brief-date-note"/>
    <p id="brief-date-note" className="mt-2 text-sm leading-relaxed text-muted-foreground">
      {value === original ? "Das Datum steht auf dem Brief. Du kannst es hier korrigieren." : `Von dir korrigiert. Im Beispielbrief erkannt: ${formatDate(original)}.`}
    </p>
  </div>;
}