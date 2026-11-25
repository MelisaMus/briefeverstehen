<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Application rules
- Keep supported languages, model/provider selection and deadline parameters in configuration modules so they can be changed centrally.
- Send transient documents only to server functions for immediate AI processing; keep results in React session state without database, storage, browser persistence or content logs.
- Use separate analyze and translate TanStack server functions with server-only gateway calls; this stack replaces new Edge Functions with createServerFn.
- Render results on a separate route from session state, showing German immediately and translating in a second request; direct reloads have an empty state, never example results.
- Define all visual roles in the global design system and use shared page and result-card components to keep accessibility and bilingual presentation consistent.
- Feed corrected letter dates into pure deadline calculation, speech and exports from session state; relative deadlines recalculate while fixed deadlines remain independent of date corrections.
- Gate both AI server functions on AI_CONTENT_LOGGING_DISABLED_VERIFIED until gateway payload capture is disabled and verified; zero provider retention alone does not disable gateway content logs.
- Derive urgent advice from a shared pure function and configured text/contact data; translate its prepared text with the letter so corrected deadlines and exports stay consistent without another AI request.
