import { createFileRoute } from "@tanstack/react-router";
import { BriefShell } from "@/components/brief-shell";
import { ImpressumContent } from "@/components/impressum-content";
import { legal } from "@/config/legal";

export const Route = createFileRoute("/impressum")({
  head: () => ({ meta: [
    { title: "Impressum | Postkompass" },
    { name: "description", content: "Impressum und Anbieterangaben von Postkompass, einem nicht-kommerziellen Projekt." },
    { property: "og:title", content: "Impressum – Postkompass" },
    { property: "og:description", content: "Anbieterangaben, Kontakt und Hinweise zur Nutzung von Postkompass." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <BriefShell steps={false}><ImpressumContent config={legal} dev={import.meta.env.DEV}/></BriefShell>,
});
