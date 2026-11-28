import { Link } from "@tanstack/react-router";
import { Check, Compass, HeartHandshake, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { LegalLinks } from "@/components/legal-links";

export function BriefShell({ children, result = false, steps = true }: { children: ReactNode; result?: boolean; steps?: boolean }) {
  return <div className="app-shell">
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Postkompass – Startseite">
          <span className="brand-mark"><Compass strokeWidth={1.7} /></span>
          <span><strong>Postkompass</strong><span className="brand-caption">Orientierung bei Behördenpost</span></span>
        </Link>
        <span className="header-note"><HeartHandshake size={19} /> Gemeinsam verstehen</span>
      </div>
    </header>
    {steps && <div className="steps" aria-label="Fortschritt">
      <span className={result ? "step complete" : "step current"}><span className="step-number">{result ? <Check size={15}/> : "1"}</span> Brief hinzufügen</span>
      <span className="step-line" />
      <span className={result ? "step current" : "step"}><span className="step-number">2</span> Brief verstehen</span>
    </div>}
    {children}
    <footer className="site-footer">
      <div className="footer-inner"><span className="footer-brand"><Compass size={18}/> Postkompass</span><span><ShieldCheck size={16}/> Wir speichern deine Briefe nicht</span><LegalLinks/><span>Mit Sorgfalt. Für Menschen.</span></div>
    </footer>
  </div>;
}