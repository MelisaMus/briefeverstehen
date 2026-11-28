// Impressum-Angaben. Werte in [eckigen Klammern] sind Platzhalter und lösen im Entwicklungsmodus eine Warnung aus.
export const legal = {
  anbieterName: "Melisa Mustafovic-Brüstle",
  strasse: "Kaiserstuhlstraße 26",
  plzOrt: "79106 Freiburg",
  email: "melisamustafovic@gmail.com",
  telefon: "[Telefonnummer]" as string | undefined,
  stand: "28. November 2026",
};

export type LegalConfig = typeof legal;

export const isPlaceholder = (value: string | undefined) => !!value && /\[[^\]]*\]/.test(value);
export const placeholderFields = (config: LegalConfig) =>
  Object.entries(config).filter(([, value]) => isPlaceholder(value)).map(([key]) => key);
/** Telefon nur zeigen, wenn wirklich gesetzt (nicht leer, kein Platzhalter). */
export const visiblePhone = (value: string | undefined) => (value && value.trim() && !isPlaceholder(value) ? value.trim() : null);
