import { createFileRoute } from "@tanstack/react-router";
import { BriefShell } from "@/components/brief-shell";
import { BackHome } from "@/components/impressum-content";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({ meta: [
    { title: "Datenschutz | Postkompass" },
    { name: "description", content: "Datenschutzerklärung von Postkompass." },
    { property: "og:title", content: "Datenschutz – Postkompass" },
    { property: "og:description", content: "Informationen zum Datenschutz bei Postkompass." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <BriefShell steps={false}><main className="page-main legal-page"><BackHome/><h1>Datenschutz</h1><p>Datenschutzerklärung folgt.</p><BackHome/></main></BriefShell>,
});
