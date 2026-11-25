export const languages = [
  { code: "ro", label: "Rumänisch", native: "Română", speech: "ro-RO" },
  { code: "bg", label: "Bulgarisch", native: "Български", speech: "bg-BG" },
  { code: "sr", label: "Serbisch", native: "Srpski", speech: "sr-RS" },
  { code: "mk", label: "Mazedonisch", native: "Македонски", speech: "mk-MK" },
  { code: "sq", label: "Albanisch", native: "Shqip", speech: "sq-AL" },
  { code: "tr", label: "Türkisch", native: "Türkçe", speech: "tr-TR" },
  { code: "ar", label: "Arabisch", native: "العربية", speech: "ar-SA" },
  { code: "uk", label: "Ukrainisch", native: "Українська", speech: "uk-UA" },
  { code: "en", label: "Englisch", native: "English", speech: "en-GB" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];
export function getLanguage(code: unknown) {
  return languages.find((language) => language.code === code) ?? languages[0];
}