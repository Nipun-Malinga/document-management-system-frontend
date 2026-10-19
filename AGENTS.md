# Repository Guide

## Project

This is a React 19 + TypeScript frontend for document management, sharing,
branching, version history, and collaborative rich-text editing. It uses Vite 7,
React Router 7, TanStack Query 5, Zustand 5, Tailwind CSS 4, shadcn/ui, and
Tiptap 3 with Yjs/Hocuspocus. REST, STOMP, and collaboration servers are external
to this repository.

Use source code and `package.json` as the authority for current behavior. The
README includes recommendations that are not implemented, including refresh-token
handling and test/format scripts.

## Setup and Commands

- Use npm and the committed `package-lock.json`; install with `npm ci`.
- The locked Vite version requires Node.js `^20.19.0 || >=22.12.0`.
- `npm run dev`: starts Vite on port 5173, bound to all interfaces. The port is
  strict, so startup fails if it is already occupied.
- `npm run build`: runs `tsc -b` followed by the production Vite build into `dist/`.
- `npm run lint`: runs ESLint over the repository.
- `npm run preview`: serves the production build locally.
- There is no configured test runner, test script, formatter, or standalone
  typecheck script. Do not assume the README's example scripts exist.

Configure local `.env` values for the services you need:

```dotenv
VITE_SERVER_URL=http://localhost:8080
VITE_SERVER_WEBSOCKET_URL=ws://localhost:8080/gs-guide-websocket
VITE_COLLABORATIVE_CRDT_SERVER_WEBSOCKET_URL=ws://localhost:1234
```

These are local examples; confirm the actual backend endpoints. Only the CRDT
URL has a code-level fallback (`ws://localhost:1234`). `.env.example` currently
lists only `VITE_SERVER_URL`. Vite embeds `VITE_*` values in the client build;
keep secrets out of them and do not commit `.env`.

## Code Map

- `src/main.tsx`: bootstrap, QueryClient provider, router, and Query devtools.
- `src/router/router.tsx`: public, dashboard, document, and admin routes.
- `src/pages/`: route-level views; `src/components/layout/`: shared navigation,
  layout, and `SecureRoute` authentication guard.
- `src/features/documents/`: document lists, sharing, metadata, templates, trash.
- `src/features/editor/`: solo/collaborative editors, toolbar, autosave, branches,
  versions, shared extensions, and editor SCSS.
- `src/features/users/`: user search and profile components.
- Feature-local `hooks/`: domain queries/mutations; auth hooks live in
  `features/auth`, profile/search in `features/users`, document data in
  `features/documents`, collaboration provider in `features/editor`, and sidebar
  queries in `features/workspace`.
- `src/services/apiService.ts`: generic Axios-backed REST service with bearer
  authentication. `src/services/websocketService.ts`: singleton STOMP client.
- Feature-local `stores/`, `types/`, and `schemas/`: Zustand state, domain
  entities, and Zod form validation owned by the corresponding feature.
- `src/shared/`: generic collection hooks, transport types, and form utilities;
  keep domain-specific types in features. See `src/features/README.md`.
- `src/components/ui/`: shadcn primitives; `src/components/common/`: app wrappers.
- `src/index.css`: Tailwind v4 configuration, theme tokens, and dark mode.
- `src/lib/utils.ts`: `cn()` for merging conditional Tailwind classes.

## Conventions

- Keep changes within the relevant feature, hook, or service. Reuse existing
  components and exports from the nearby `index.ts` barrel files.
- Use the `@/` alias for imports from `src/`. Match surrounding formatting;
  most application files use two-space indentation, single quotes, and semicolons.
- Use PascalCase for components and `useXxx` for hooks. Prefer explicit TypeScript
  types and `import type` for type-only imports. Strict checking and unused
  local/parameter checks are enabled.
- Keep REST access in `APIService`-backed hooks and server state in TanStack Query.
  Reuse existing query-key conventions and invalidate affected caches after
  mutations. Use Zustand for local UI/editor state.
- Reuse Tailwind utilities, theme variables, and existing light/dark patterns.
  Tailwind is configured through CSS and the Vite plugin, not a JS config file.

## Behavior to Preserve

- Authentication currently reads the `jwt-access-token` localStorage entry via
  `src/features/auth/utils/authUtils.ts`; Axios attaches it as a bearer token.
  There is no refresh-token interceptor. Coordinate auth changes across REST, STOMP,
  Hocuspocus, and `SecureRoute`.
- Document operations are scoped by both document ID and branch ID. Collaboration
  rooms use `documents/${documentId}/branches/${branchId}`; preserve that contract.
- Keep permission checks and read-only editor/toolbar behavior intact.
- Shared Tiptap configuration lives in `features/editor/configs/EditorConfigs.ts`.
  Collaborative mode disables StarterKit undo/redo and uses Yjs collaboration.
- Solo autosave serializes editor JSON every 30 seconds. Collaborative mode
  disables that autosaver. Preserve the distinction when changing persistence.
- Manage timers, subscriptions, and provider lifecycles carefully when changing
  realtime code, especially when switching documents or branches.

## Validation

For application changes, run `npm run lint` and `npm run build` when dependencies
are available. Report failures and distinguish pre-existing issues from changes
introduced by the task. Do not add unrelated cleanup to make checks pass.

For UI or behavior changes, also exercise the affected flow locally with the
required backend services. Editor changes should cover the affected solo or
collaborative mode, permissions, branch switching, and saving as applicable.
Documentation-only changes need a content and diff review; installing dependencies
or running the application build is unnecessary.

Production uses `dockerfile.prod` to build the SPA and serve it through nginx on
port 8080; `compose.prod.yml` maps host port 5173 to it. Preserve nginx's SPA
fallback for client-side routes. Environment values must be present at build time.
