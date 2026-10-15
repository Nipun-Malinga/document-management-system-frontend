# Document Management — Frontend

React 19 and TypeScript frontend for documents, sharing, branches, version
history, and rich-text editing. It uses Vite 7, React Router, TanStack Query,
Zustand, Tailwind CSS 4, shadcn/ui, and Tiptap 3 with Yjs/Hocuspocus.
The REST, STOMP, and Hocuspocus servers run separately.

## Setup

Use npm with the committed `package-lock.json`. The locked Vite version requires
Node.js `^20.19.0 || >=22.12.0`; TypeScript remains at 5.9.3.

```bash
npm ci
cp .env.example .env
npm run dev
```

Confirm your service endpoints and edit `.env` before starting. Local examples:

```dotenv
VITE_SERVER_URL=http://localhost:8080/api
VITE_SERVER_WEBSOCKET_URL=ws://localhost:8080/gs-guide-websocket
VITE_COLLABORATIVE_CRDT_SERVER_WEBSOCKET_URL=ws://localhost:1234
```

The REST base URL must include `/api`; service hooks append paths such as
`/documents`. Only the CRDT URL has a code-level fallback (`ws://localhost:1234`).
Vite embeds `VITE_*` values in the browser build, so keep secrets out of them and
do not commit `.env`.

## Commands

- `npm run dev`: starts Vite on port 5173, bound to all interfaces. The port is
  strict; startup fails if occupied.
- `npm run build`: runs `tsc -b`, then builds production assets into `dist/`.
- `npm run preview`: serves the production build locally.
- `npm run lint`: checks formatting, imports, and lint rules with Biome, then runs
  ESLint for React Hooks and React Refresh checks.
- `npm run lint:fix`: applies Biome safe fixes and ESLint fixes.
- `npm run format`: formats supported files with Biome.
- `npm test`: runs Vitest once with jsdom and React Testing Library.
- `npm run test:watch`: runs Vitest in watch mode.

Biome settings live in `biome.json`, including Tailwind CSS directive parsing.
Keep `src/components/ui` shadcn components in their existing structure; format and
organize imports normally, and keep semantic exceptions narrow and documented.
There is no standalone typecheck script. Tests live in
`tests/**/*.test.ts(x)`, mirroring the source folders; shared test setup is in
`tests/setup.ts`, alongside shared fixtures and helpers.

## Source layout

- `src/main.tsx` and `src/router/router.tsx`: providers, bootstrap, and routing.
- `src/pages/` and `src/components/layout/`: route views, navigation, route guard.
- `src/features/documents/`: lists, metadata, sharing, templates, and trash.
- `src/features/editor/`: editors, toolbar, autosave, branches, and versions.
- `src/hooks/` and `src/services/`: TanStack Query hooks, Axios REST access,
  STOMP, and collaboration providers.
- `src/states/`: Zustand UI/editor state.
- `src/models/` and `src/types/`: shared entities and request/form types.
- `src/components/ui/` and `src/components/common/`: UI primitives and wrappers.
- `src/index.css`: Tailwind configuration and light/dark theme tokens.

## Current behavior

- Access tokens use the `jwt-access-token` localStorage key. Axios attaches them
  as bearer credentials. Protected routes require structurally valid, unexpired
  user claims; admin routes additionally require `ADMIN`. JWT signature and
  authorization enforcement belong to the backend. Login and refresh send
  credentials for the HttpOnly refresh cookie. Protected 401s share one refresh
  and retry once; public auth endpoints and 403s are excluded. Expired stored
  access tokens may recover; missing tokens remain signed out.
- Session changes cancel REST requests, reject late completions, stop realtime
  providers, and clear user caches/UI state. Cross-tab account changes and logout
  are observed. Logout is local; the current backend has no cookie-revocation
  endpoint. Recovery hides/inerts protected content while preserving an existing
  editor, disables editing, and terminates the session on failure.
- STOMP reads credentials before each CONNECT and restores active subscriptions
  once per connection. Hocuspocus uses a token callback and renews its connection
  without replacing the Y.Doc. Unmounting or switching accounts destroys the old
  provider and document.
- Editor access is checked for both document ID and branch ID. Only `READ_WRITE`
  and `ADMIN` permissions enable editing and write controls. Ownership gates
  favorites, metadata updates, sharing, and trash actions.
- Collaboration room names are `documents/{documentId}/branches/{branchId}`.
  Shared editor configuration is in `features/editor/configs/EditorConfigs.ts`.
  Collaborative mode disables StarterKit undo/redo and uses Yjs.
- Collection hooks consume `PageResponse<T>.content` with zero-based pages,
  default size 20, and a maximum size of 50. Documents, favorites, shared
  documents, branches, versions, trash, collaborators, and templates expose
  pagination and server filters/sorting. Filters use exact matches and reset the
  page when applied. Loading and failed requests are distinct from empty results.
  Quick access requests `favorite=true`; totals come from `totalElements`.
- Home and Recents exact-title search wait 300ms after typing and reset the page.
  Recents lists owned, non-trashed documents sorted by `updatedAt,desc`, with a
  count from `totalElements`. It does not track viewing history. Unavailable
  sidebar counts show a placeholder rather than zero.
- Successful document mutations await affected metadata, collection variants,
  and count refreshes. Rename/create also seed returned document metadata;
  deletion clears affected cached content. Failed mutations show recovery
  feedback and are not automatically replayed by TanStack Query.
- User lookup runs only after a valid email is submitted and encodes the email
  in the URL. Registration follows backend name/username/password boundaries;
  auth forms accept valid emails over 30 characters and display field errors
  and distinct username/email conflicts while retaining inputs.
- Version dates use `createdAt`; branch trash normalizes `added_date` to
  `addedDate`. Trash dates are server-reported, not reliable persisted deletion
  history. Failed template creation shows an error and permits an explicit retry.
- Solo editors save dirty JSON to REST on the 30-second interval. Writes are
  serialized and acknowledge only the revision sent; failed content stays in
  the mounted editor with an explicit retry. Navigation, logout, and solo
  branch/version snapshots await saving. Failed transitions require retry,
  staying in the editor, or explicit discard; browser unload warns while dirty.
- Version preview reads its saved snapshot. Solo merges overwrite the active
  branch with the selected branch/version after confirmation and saving, then
  reload authoritative content. A failed reload pauses editing/saving and can
  be retried without repeating the merge.
- Collaborative mode never invokes the REST autosaver. First sharing and
  collaborative snapshots/merges are disabled until external CRDT initialization
  and persistence/replacement are verified. A metadata refresh cannot switch a
  mounted solo editor into collaborative mode. REST writes must not be assumed
  to synchronize the external CRDT server.
- Image uploads accept PNG/JPEG only. Failed uploads report errors and insert no
  placeholder; insertion requires a successful HTTP(S) cloud URL and the same
  live, writable editor/session. Collaboration connection failures are visible
  without claiming that local content has been persisted by the server.
- Version deletion, document-level STOMP presence, automatic trash retention,
  and several other flows are unsupported or pending repair. See
  [the staged implementation plan](docs/frontend-implementation-fix-plan.md).

## Validation

Run `npm test`, `npm run lint`, and `npm run build` for application changes.
Tests mock service/provider boundaries and do not establish live
backend or CRDT compatibility. Exercise affected owner, writer, reader,
unauthorized, admin, solo, and collaborative flows against the actual services.

## Deployment

`dockerfile.prod` builds the SPA and serves it through nginx on container port 8080. `compose.prod.yml` maps host port 5173 to that port. Preserve nginx's SPA
fallback for client-side routes. Supply environment values at build time;
changing container environment variables after building does not update the
embedded client configuration.
