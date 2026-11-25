import { useEffect, useState, type ReactNode } from "react";
import { Volume2, Square, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getLanguage, type LanguageCode } from "@/config/languages";

export function ResultCard({ title, icon: Icon, children, language, germanText, translatedText, className = "" }: {
  title: string; icon: LucideIcon; children: ReactNode; language: LanguageCode; germanText: string; translatedText: string; className?: string;
}) {
  const [speaking, setSpeaking] = useState<string | null>(null);
  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);
  const speak = (target: boolean) => {
    if (!("speechSynthesis" in window)) { toast.info("Vorlesen wird von diesem Browser nicht unterstützt."); return; }
    const code = target ? language : "de";
    window.speechSynthesis.cancel();
    if (speaking === code) { setSpeaking(null); return; }
    const utterance = new SpeechSynthesisUtterance(target ? translatedText : germanText);
    utterance.lang = target ? getLanguage(language).speech : "de-DE";
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => { setSpeaking(null); toast.info("Für diese Sprache ist möglicherweise keine Stimme verfügbar."); };
    setSpeaking(code);
    window.speechSynthesis.speak(utterance);
  };
  return <section className={`result-card ${className}`}>
    <div className="result-card-header"><span className="card-icon"><Icon size={23} strokeWidth={1.8}/></span><h2>{title}</h2></div>
    <div className="result-card-body">{children}</div>
    <div className="card-speech">
      <Button variant="ghost" size="sm" onClick={() => speak(false)} aria-label={`${title} auf Deutsch vorlesen`} title="Auf Deutsch vorlesen">{speaking === "de" ? <Square/> : <Volume2/>} Deutsch</Button>
      <Button variant="ghost" size="sm" onClick={() => speak(true)} aria-label={`${title} auf ${getLanguage(language).label} vorlesen`} title={`Auf ${getLanguage(language).label} vorlesen`}>{speaking === language ? <Square/> : <Volume2/>} {getLanguage(language).native}</Button>
    </div>
  </section>;
}

export function Bilingual({ de, target, language }: { de: string; target: string; language: LanguageCode }) {
  return <div className="bilingual"><p>{de}</p><p className="translation" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>{target}</p></div>;
}