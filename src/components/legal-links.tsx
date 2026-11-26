import { Link } from "@tanstack/react-router";

export function LegalLinks() {
  return <nav className="legal-links" aria-label="Rechtliches">
    <Link to="/impressum">Impressum</Link>
    <Link to="/datenschutz">Datenschutz</Link>
  </nav>;
}
