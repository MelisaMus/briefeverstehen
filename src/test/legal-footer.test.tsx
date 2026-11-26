import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BriefShell } from "@/components/brief-shell";
import { ImpressumContent } from "@/components/impressum-content";
import { legal } from "@/config/legal";

async function renderAt(path: string, ui: () => React.ReactNode) {
  const root = createRootRoute({ component: Outlet });
  const routes = ["/", "/ergebnis", "/impressum", "/datenschutz"].map((p) => createRoute({ getParentRoute: () => root, path: p, component: ui }));
  const router = createRouter({ routeTree: root.addChildren(routes), history: createMemoryHistory({ initialEntries: [path] }) });
  render(<RouterProvider router={router as never}/>);
  if (path === "/impressum") { await screen.findByRole("heading", { name: "Impressum" }); return []; }
  return screen.findAllByRole("link", { name: "Impressum" });
}

describe("Impressum", () => {
  it("Startseite zeigt Impressum- und Datenschutz-Link in der Fußzeile", async () => {
    const links = await renderAt("/", () => <BriefShell><p>Start</p></BriefShell>);
    expect(links[0]?.getAttribute("href")).toBe("/impressum");
    expect(screen.getByRole("link", { name: "Datenschutz" }).getAttribute("href")).toBe("/datenschutz");
  });
  it("Ergebnisseite zeigt Impressum-Link in der Fußzeile", async () => {
    const links = await renderAt("/ergebnis", () => <BriefShell result><p>Ergebnis</p></BriefShell>);
    expect(links[0]?.getAttribute("href")).toBe("/impressum");
  });
  it("blendet Telefon aus, wenn leer", async () => {
    await renderAt("/impressum", () => <ImpressumContent config={{ ...legal, telefon: "" }}/>);
    expect(screen.queryByText(/Telefon:/)).toBeNull();
    expect(screen.getByRole("link", { name: legal.email }).getAttribute("href")).toBe(`mailto:${legal.email}`);
  });
  it("zeigt Telefon als tel:-Link, wenn gesetzt", async () => {
    await renderAt("/impressum", () => <ImpressumContent config={{ ...legal, telefon: "0761 123456" }}/>);
    expect(screen.getByRole("link", { name: "0761 123456" }).getAttribute("href")).toBe("tel:+49761123456");
  });
  it("warnt im Entwicklungsmodus bei Platzhaltern", async () => {
    await renderAt("/impressum", () => <ImpressumContent config={legal} dev/>);
    expect(screen.getByRole("alert").textContent).toContain("strasse");
  });
});
