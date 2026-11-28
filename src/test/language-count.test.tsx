import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Route } from "@/routes/index";
import { LetterSessionProvider } from "@/components/letter-session";
import { languages } from "@/config/languages";

// The start page shows the number of target languages twice: in the browser
// description and in the trust line. Both must follow src/config/languages.ts
// so a new language never leaves a stale count behind.
describe("Sprachzahl auf der Startseite", () => {
  it("zählt die Zielsprachen aus der Sprachliste", () => {
    const meta = (Route.options.head?.({} as never) as { meta: { content?: string }[] }).meta;
    const description = meta.find((entry) => entry.content?.includes("weiteren Sprachen"))?.content ?? "";
    expect(description).toContain(`${languages.length} weiteren Sprachen`);
  });

  it("zeigt die Sprachzahl in der Vertrauenszeile", async () => {
    const root = createRootRoute({ component: Outlet });
    const index = createRoute({ getParentRoute: () => root, path: "/", component: Route.options.component as never });
    const router = createRouter({ routeTree: root.addChildren([index]), history: createMemoryHistory({ initialEntries: ["/"] }) });
    render(<LetterSessionProvider><RouterProvider router={router as never}/></LetterSessionProvider>);
    expect(await screen.findByText(`${languages.length} Zielsprachen`)).toBeTruthy();
    expect(screen.queryByText("9 Zielsprachen")).toBeNull();
  });
});
