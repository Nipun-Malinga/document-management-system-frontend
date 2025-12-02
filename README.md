# Document Management — Frontend

A fast, collaborative document-management frontend built with **TypeScript + React**.

Key features: collaborative rich-text editing (**Tiptap + Yjs** via **Hocuspocus**), real-time presence & notifications (**STOMP** over WebSocket via **stomp.js**), client state with **Zustand**, remote state & caching with **React Query**, UI primitives from **shadcn/ui**, **Tailwind** for styling, and a refresh-token based auth flow.

---

## Quick Summary

**Tech:** React + TypeScript, Vite, Tailwind CSS, Zustand, React Query, Tiptap, Yjs + Hocuspocus provider, stomp.js, shadcn/ui

**Primary responsibilities:**

- Collaborative editor with autosave, branching, versions, and online users
- Document CRUD and sharing flows
- Notifications + realtime presence
- Token refresh / secure session handling

---

## Table of Contents

- [Folder Overview](#folder-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Architecture Notes & Patterns](#architecture-notes--patterns)
- [Important Implementation Details](#important-implementation-details--tips)
- [Development & Debugging Tips](#dev--debugging-tips)
- [Testing & Quality](#tests--linting)
- [Deployment](#deployment)
- [License](#license)

---

## Folder Overview

(You provided the project tree — here's a condensed explanation of important dirs and responsibilities.)

- **`assets/`** — static assets for the editor (icons, toolbar assets, placeholder images)
- **`components/`** — reusable UI & layout components
  - `components/common/` — small primitives used widely (Alert, Button, Table, etc.)
  - `components/ui/` — shadcn-style components wrapped for this app
  - `components/layout/` — auth pages, sidebar, secure route wrapper
- **`features/`** — domain features grouped by area
  - `features/documents` — document list, grids, document cards, trash, templates
  - `features/editor` — Tiptap integration, collaborative core, autosave, toolbar
  - `features/users` — user search, profile popup
- **`hooks/`** — composable hooks (React Query hooks, collaboration hooks, provider hooks)
- **`states/`** — global UI-only state slices (Zustand)
- **`services/`** — network logic (`apiService.ts`, `websocketService.ts`)
- **`models/`, `types/`** — TypeScript interfaces/models shared across the app
- **`pages/`** — route pages (Dashboard, Editor, Home, etc.)
- **`router/`** — app routing (React Router)
- **`utils/`** — helper utilities (auth helpers, small pure functions)
- **`lib/`** — general utilities used cross-cutting
- **`index.css`, `main.tsx`** — app bootstrap and global styles

---

## Getting Started

### Prerequisites

- Node.js (recommended v18+)
- pnpm / npm / yarn (pick one)

### Install & Run

```bash
# install
npm install   # or npm install / yarn

# dev
npm run dev       # starts vite dev server (default :5173)

# build
npm run build
```

### Useful Scripts

(Add to `package.json` if not present):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  }
}
```

---

## Environment Variables

This project uses Vite; use `VITE_` prefixes. Example `.env` (do not commit secrets):

```env
VITE_SERVER_URL=http://localhost:8080
VITE_SERVER_WEBSOCKET_URL=ws://localhost:8080/gs-guide-websocket
VITE_COLLABORATIVE_CRDT_SERVER_WEBSOCKET_URL=ws://localhost:1234
```

**Note:** Your auth tokens are stored/managed by the `authUtils.ts` helpers — refresh token storage should be **HTTP-only cookie** on production; avoid storing refresh tokens in `localStorage`.

---

## Architecture Notes & Patterns

### 1. Data Fetching and Cache

- Use **React Query** for all server communication that represents remote state (documents list, metadata, collaborators)
- Prefer `useQuery` with appropriate `staleTime`/`cacheTime` for lists; invalidate queries on mutations with `queryClient.invalidateQueries(...)`
- Use optimistic updates for fast UX when editing metadata (title, tags), but always have rollback logic for failures

### 2. Local UI State

- Use **Zustand** for UI-only state (sidebars, modals, editor ui state)
- Keep domain data (documents, collaborators) in React Query, and only mirror IDs or UI toggles in Zustand

### 3. Auth (Access + Refresh Tokens)

- **Access token:** short-lived JWT in memory (or cookie)
- **Refresh token:** stored as HTTP-only secure cookie (recommended) and exchanged via a server endpoint to rotate tokens
- **Interceptor pattern** in `apiService.ts`: attach access token to requests; on 401, attempt a single refresh flow then retry the original request. Avoid race conditions by queueing requests while refresh in progress (single flight)

### 4. Real-Time Collaboration

- Editor uses **Tiptap + Yjs**. The client provider is Hocuspocus's provider (see `hooks/document/collaboration/useProvider.ts`)
- The app keeps presence (online cursors, user list) via separate presence messages — keep presence data out of the main CRDT document to avoid large binary diffs
- **Autosave:** keep editor-local `lastSaved` and debounce server saves for every X seconds or when a branch/version action happens
- **Branching/versions:** treat versions as immutable snapshots. When merging, show a three-pane diff preview and prevent auto-merge unless conflict-free

### 5. Websockets & Notifications

- `websocketService.ts` encapsulates stomp.js connection. Use automatic reconnects with exponential backoff and jitter. Re-authenticate on reconnect with a valid access token
- Use dedicated channels per document where required, and a global channel for notifications

---

## Important Implementation Details & Tips

- **Tiptap + Images:** `imageUploadHandler.ts` should upload images to the backend, then insert a stable CDN URL into the editor. Avoid embedding base64 for large images
- **CRDT size:** Prune editor history on the server for old versions to keep Yjs doc small. Consider snapshot compression before persisting
- **Debounce + Throttle:** Use AutoSaver with debounce (e.g., 2–4s) and guard against saving when provider is disconnected
- **Unauthorized users:** UI must show read-only skeleton when permissions are insufficient; don't rely on client checks — back-end must enforce
- **Branch operations:** Creating a branch should copy the current snapshot from the CRDT server or request a version snapshot from the API to ensure consistency
- **Refresh flow concurrency:** If multiple requests fail with 401 simultaneously, avoid multiple refresh calls. Implement a refresh queue/promise to serialize refresh attempts
- **Error handling:** Centralized error boundary at App level plus local boundaries for editor to avoid losing unsaved content

---

## Dev & Debugging Tips

- **Editor debugging:** enable verbose logs on the Hocuspocus provider during development to diagnose sync / awareness issues
- **Reconnect testing:** simulate network flakiness using Chrome DevTools to verify reconnection and token refresh behavior
- Use **React Query devtools** during development to inspect cache and invalidations
- When changing shared types, bump API contract version and handle migration gracefully in providers

---

## Security & Production Considerations

- **NEVER** store refresh tokens in `localStorage`. Use secure, `sameSite`, `httpOnly` cookies for refresh tokens
- **Protect Yjs/Hocuspocus endpoints:** ensure only authenticated and authorized clients can join a document room
- Rate-limit public endpoints like image uploads
- Sanitize content server-side for any content that's converted to HTML or rendered in safe containers
- Use CSP headers and secure cookies in production

---

## Recommended Conventions

- **Types:** prefer `models` for runtime entities and `types` for API/DTO shapes
- **Folder granularity:** group feature-related components/hooks/types together (already followed)
- **Naming:** `useXxx` for hooks, `XxxService` for network services, `XxxRepo` only if you abstract data sources
- **Tests:** unit-test hooks and services; integration test editor flows where possible with headless browsers

---

## Tests & Linting

- Use **Vitest** for unit tests + **React Testing Library** for component testing
- **Linting:** ESLint + TypeScript rules. Enforce strict mode in `tsconfig`
- **Format:** Prettier for consistent formatting
- Add a small test suite for critical flows: token refresh, provider reconnection, and autosave

---

## Deployment

- Static build produced by `pnpm build` (Vite). Host static assets on Vercel / Netlify / Cloudflare Pages
- **Edge cases:** If you serve via CDN, make sure service worker and caching are configured so dynamic endpoints (`/api`, websockets) bypass CDN
- **Environment configuration:** inject `VITE_*` env variables at build time; secrets (refresh token path) handled by backend cookies

---

## Appendix — Example API Patterns

### apiService (pseudo)

```typescript
// attach access token
api.interceptors.request.use((req) => {
  const token = authUtils.getAccessToken();
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// response interceptor to handle 401 -> refresh -> retry
api.interceptors.response.use(null, async (error) => {
  if (error.response?.status === 401) {
    await authUtils.singleFlightRefresh();
    // retry original request
    return api.request(error.config);
  }
  throw error;
});
```

### websocketService

Wrap stomp.js connect/disconnect, re-subscribe handlers, and expose `send(destination, body)`.

---
