# Feature ownership

Keep domain hooks, types, form schemas, and Zustand stores inside the feature
that owns them. Pages compose features; shared code contains reusable mechanics.

| Feature | Responsibility |
| --- | --- |
| `auth` | Sign-in, registration, current-session hooks, session store, token helpers, and auth schemas |
| `documents` | Document collections, metadata, content requests, branches, versions, sharing, permissions, templates, trash, and document-info popup state |
| `editor` | Tiptap editing, collaboration provider lifecycle, save coordination, uploads, and editor UI stores |
| `users` | User lookup, profile/password forms, account hooks, user models, and profile popup state |
| `workspace` | Sidebar statistics, navigation types, and sidebar collapse state |

Use these folders within each feature as needed:

- `hooks/` for feature queries, mutations, and React helpers.
- `types/` for domain entities and request/response types.
- `schemas/` for Zod validation and its inferred form types.
- `stores/` for Zustand state owned by that feature.
- `utils/` for feature-specific helpers.

Use `@/features/<feature>/...` when importing feature code. Reuse the existing
hook barrels where appropriate. Keep feature internals out of generic shared
modules. Shared `PageParams` and `PageResponse` describe pagination only;
document filters belong in `documents/types/CollectionParams`.

`src/shared/` owns generic collection hooks, transport/error types, and form and
collection utilities. UI primitives remain in `src/components/ui`, and common
layout components remain in `src/components`. `src/services` supplies shared
HTTP, websocket, and session-runtime integration.

Existing hook and schema tests live beside the corresponding feature test
folders under `tests/features/`. Shared collection hook integration tests remain
in `tests/hooks/`. Update test imports and mocks when moving a feature module.
