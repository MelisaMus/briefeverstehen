import { Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLanguage, languages, type LanguageCode } from "@/config/languages";

export function LanguagePicker({ value, onChange, id = "language" }: { value: LanguageCode; onChange: (value: LanguageCode) => void; id?: string }) {
  return <Select value={value} onValueChange={(code) => onChange(getLanguage(code).code)}>
    <SelectTrigger id={id} className="language-select" aria-label="Zielsprache"><span className="select-content"><Languages size={20}/><SelectValue /></span></SelectTrigger>
    <SelectContent>{languages.map((language) => <SelectItem key={language.code} value={language.code}>{language.label} · {language.native}</SelectItem>)}</SelectContent>
  </Select>;
}