import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/deadlines";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export function BriefDateField({ value, original, onChange }: {
  value: string; original: string; onChange: (date: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return <div className="mt-5 border-t border-border pt-4">
    <div className="flex items-center justify-between gap-2"><label htmlFor="brief-date" className="field-label">Briefdatum laut Brief:</label><Button variant="ghost" size="icon" title="Briefdatum korrigieren" aria-label="Briefdatum korrigieren" onClick={() => { inputRef.current?.focus(); inputRef.current?.showPicker?.(); }}><Pencil/></Button></div>
    <Input ref={inputRef} id="brief-date" type="date" value={value} onChange={(event) => {
      const next = event.target.value;
      if (next && event.target.validity.valid) onChange(next);
    }} required className="h-12 max-w-64 bg-card text-base" aria-describedby="brief-date-note"/>
    <p id="brief-date-note" className="mt-2 text-sm leading-relaxed text-muted-foreground">
      {!original ? "Kein Briefdatum erkannt. Bitte das Datum auf dem Brief prüfen und ergänzen." : value === original ? "Bitte mit dem Originalbrief vergleichen." : `Von dir korrigiert. Im Brief erkannt: ${formatDate(original)}.`}
    </p>
  </div>;
}