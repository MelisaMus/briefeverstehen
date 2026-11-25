import { TriangleAlert, MapPin, Phone, ExternalLink, Clock3 } from "lucide-react";
import { ResultCard } from "./result-card";
import { adviceTitle } from "@/config/urgent-advice";
import type { LanguageCode } from "@/config/languages";
import type { AdviceService } from "@/lib/urgent-advice";

export function UrgentAdviceNotice({ german, target, services, language, translating, showTranslation }: {
  german: string; target: string; services: AdviceService[]; language: LanguageCode; translating: boolean; showTranslation: boolean;
}) {
  return <div role="region" aria-label={adviceTitle} aria-live="polite" className="urgent-advice-region">
    <ResultCard title={adviceTitle} icon={TriangleAlert} className="urgent-advice-notice" germanText={german} translatedText={target} language={language} translating={translating} showTranslation={showTranslation}>
      <div className="bilingual urgent-advice-copy">
        {german.split("\n\n").slice(1).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {showTranslation && target && <p className="translation" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>{target}</p>}
      </div>
      {services.length > 0 && <ul className="advice-services">{services.map((service, index) => {
        const phone = service.telefon.replace(/[^+\d]/g, "");
        return <li key={`${service.name}-${index}`}>
          <strong>{service.name}</strong>
          {service.adresse && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.adresse)}`} target="_blank" rel="noopener noreferrer"><MapPin size={19}/>{service.adresse}</a>}
          {phone && <a href={`tel:${phone}`}><Phone size={19}/>{service.telefon}</a>}
          {service.oeffnungszeiten && <p><Clock3 size={19}/>{service.oeffnungszeiten}</p>}
          {/^(https?:\/\/)/.test(service.link) && <a href={service.link} target="_blank" rel="noopener noreferrer"><ExternalLink size={19}/>{service.name}</a>}
        </li>;
      })}</ul>}
    </ResultCard>
  </div>;
}