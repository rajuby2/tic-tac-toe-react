React Project — Copilot-Friendly Documentation

> Goal: a single, precise, machine- and human-readable reference that enables GitHub Copilot (or any coding assistant) to generate, place, and wire up new functionality reliably and with minimal human iteration.

How to use this doc: keep it in /docs/PROJECT_DOCUMENTATION.md and keep src/ code and inline JSDoc/TS types in sync. Maintain a documentation-manifest.json (see Appendix) that maps component and API signatures to file paths.




---

Table of Contents

1. Quick Metadata & Links


2. Project Summary & Scope


3. Canonical Folder Structure & Intent


4. Where to Implement What — Decision Matrix


5. Component Specification (single-source format)


6. Hook Specification & Patterns


7. State Management Guidelines (global/local)


8. API / Services Contracts


9. Styling, Theming & Design Tokens


10. Routing & Pages


11. Testing Strategy (unit / integration / e2e / visual)


12. Accessibility & Internationalization


13. Performance, Monitoring & Error Handling


14. Security & Secrets


15. Local Developer Environment & Scripts


16. CI / CD & Preview Envs


17. Release, Versioning & Changelog


18. Code Review & PR Checklist (checklist for Copilot)


19. Feature Playbook — step-by-step (how Copilot should add features)


20. Copilot Interaction Templates & Examples


21. Scaffolding & Automation (plop/CLI generators)


22. Troubleshooting / Common Gotchas


23. Appendix — Code Templates & Manifest format




---

Quick Metadata & Links

Repository: git@github.com:your-org/your-repo.git

Main branch: main

Framework: React (vX.Y.Z) — specify exact version here

Language: TypeScript (preferred) / JavaScript

UI system: Tailwind / Styled-Components / MUI — pick one (state here)

Storybook: https://<storybook-preview>/ (if available)

API docs: openapi.yaml (path or URL)

E2E: Cypress (folder cypress/)

CI: GitHub Actions (.github/workflows) — list important workflows

Maintainer / Owner: Name + contact

Last updated: YYYY-MM-DD


> Note for Copilot: When editing, always check documentation-manifest.json in the repo root (automatically generated) to find canonical file paths and exported types. If manifest is missing, update it after creating new components.




---

Project Summary & Scope

One-line: (Write a concise one-line summary of the app)

Scope: What areas Copilot is allowed to touch automatically (e.g., UI components, pages, API clients) and what to require human approval for (e.g., authentication flows, payment logic, infra changes).

Design principles: Prefer composition over inheritance; small focused components; typed public props; backward-compatible changes; test-first changes.



---

Canonical Folder Structure & Intent

Use this as the semantic map Copilot uses to place code. Small deviations are OK but follow the intent.

src/
  app/                # top-level app bootstrap (App.tsx, root providers, router)
  pages/              # route-level components (page per route)
  features/           # feature folders (feature-first grouping)
    <feature-name>/
      ui/             # presentational components used only in this feature
      hooks/          # feature-specific hooks
      api.ts          # service client for the feature (typed)
      slice.ts        # redux slice or context provider (if feature uses global state)
      index.ts        # public re-exports for feature
  components/         # reusable, generic components (ui primitives)
  hooks/              # shared custom hooks
  store/              # redux store, root reducer, store config
  services/           # network clients, axios instances, api wrappers
  styles/             # theme, tokens, global styles
  utils/              # pure helpers and utilities
  assets/             # static assets
  types/              # global TypeScript types and shared interfaces
  tests/              # integration tests (optional)
  config/             # config files consumed at runtime/build-time

Feature-first structure is recommended for large apps: group related UI, hooks, API and store artifacts together so Copilot knows where to add new feature bits.


---

Where to Implement What — Decision Matrix

This explicit table tells Copilot "if change X is requested, edit these paths/files".

Change requested	Primary location to implement	Secondary/aux files to update	Rationale

New UI component used across app	src/components/<Name>/	src/styles/, src/types/	Reusable components live under components/
Page-level feature (route)	src/pages/<route>/ and src/features/<feature>/	src/app/App.tsx (add route), src/store/	Pages map 1:1 to routes — feature code in features/
Add state to global store	src/features/<feature>/slice.ts and src/store/rootReducer.ts	src/types/	Keep slice next to feature for discoverability
API call for feature	src/features/<feature>/api.ts or src/services/apiClient.ts	src/types/	Keep API contract close to feature
Styling for a component	src/components/<Name>/<Name>.module.css or styled file	src/styles/theme.ts	Component-level styles live with component
New custom hook	src/hooks/ or src/features/<feature>/hooks/	tests in __tests__/	Shared hooks in top-level hooks/
New page-level route	src/pages/<Route>/index.tsx, update src/app/routes.tsx	src/features/<feature>	Pages are route entrypoints
Add integration tests	cypress/integration/<feature>.spec.ts	src/features/<feature>/	E2E tests live alongside cypress folder


Decision tree (short):

1. Is it UI-only and reusable? -> components/


2. Is it page-specific? -> pages/ + features/<feature>/


3. Is it global state or cross-cutting? -> store/ + features/ slice


4. Is it network/API work? -> features/<feature>/api.ts or services/




---

Component Specification (single-source format)

Every component added to the repo must include a small COMPONENT.md (or JSDoc + typed exports) that Copilot can read. Example COMPONENT.md fields:

displayName — PascalCase name

path — file path

purpose — single sentence

publicProps — typed shape (TS interface or PropTypes table)

internalState — brief list

sideEffects — network calls, analytics events

accessibility — aria roles/labels required

story — Storybook story name

tests — tests to include


Example COMPONENT.md (YAML-like):

displayName: UserCard
path: src/components/UserCard/index.tsx
purpose: Shows avatar and primary user information; clickable to select
publicProps:
  - name: string
  - email: string
  - onSelect?: (id: string) => void
internalState:
  - isExpanded: boolean
sideEffects:
  - logs 'user_card.view' to analytics
accessibility:
  - role: button
  - aria-label: 'user card <name>'
stories:
  - UserCard/Default
tests:
  - renders name and email
  - calls onSelect when clicked

In-file requirement: always include typed props and a brief JSDoc block at top of component file. Example (TypeScript):

/**
 * UserCard
 * Shows a compact user card.
 * @props {UserCardProps}
 */
export interface UserCardProps {
  id: string;
  name: string;
  email?: string;
  onSelect?: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ id, name, email, onSelect }) => {
  // implementation
};


---

Hook Specification & Patterns

1. Naming: useFeatureThing (camelCase, prefixed with use)

2. Location: src/hooks/ for shared hooks; src/features/<feature>/hooks/ for feature-specific hooks.

3. Signature doc: every hook must export a named type for its return value so Copilot can infer usage.

Hook template (TS):

export interface UseUserDataResult {
  data?: User;
  loading: boolean;
  error?: Error;
  reload: () => Promise<void>;
}

export function useUserData(userId: string): UseUserDataResult {
  // implementation
}

4. Side effects & cleanup: Document network subscriptions, setIntervals etc. Hooks must always clean up.


---

State Management Guidelines (global/local)

Global store: prefer Redux Toolkit (RTK) with slices per features/<feature>/slice.ts.

Slice template:

// src/features/profile/slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface ProfileState { user?: User; loading: boolean }

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async (id: string) => {
  return api.get(`/users/${id}`);
});

const slice = createSlice({
  name: 'profile',
  initialState: { loading: false } as ProfileState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchProfile.pending, state => { state.loading = true; });
    builder.addCase(fetchProfile.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; });
  }
});

export default slice.reducer;

Local state: use useState / useReducer inside components for UI-only state.

Selectors & Memoization: place selectors close to slice and export them. Prefer reselect patterns or memoized selectors to reduce re-renders.


---

API / Services Contracts

Where: src/features/<feature>/api.ts for feature-scoped clients, src/services/apiClient.ts for common http client.

Requirements:

Use a central HTTP client (Axios or fetch wrapper) with interceptors for auth, error handling and telemetry.

Strongly type responses (TS interfaces). When possible, derive types from openapi.yaml.

Provide wrapper functions per endpoint (do not export raw Axios instances directly unless necessary).

Include example request & response in JSDoc for each exported function.


Client template:

// src/services/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({ baseURL: process.env.REACT_APP_API_BASE });

apiClient.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;

Feature API template:

// src/features/users/api.ts
import apiClient from 'src/services/apiClient';

/**
 * Fetch users
 * @returns {Promise<UsersListResponse>}
 */
export const fetchUsers = async (page = 1) => {
  const res = await apiClient.get(`/users?page=${page}`);
  return res.data as UsersListResponse;
};

Error handling: return normalized error objects { message, code, details } and throw or reject with that shape.


---

Styling, Theming & Design Tokens

Approach: keep tokens and theme in src/styles/theme.ts and a runtime ThemeProvider in src/app/providers.

Design tokens example:

export const tokens = {
  colors: {
    primary: '#2563eb',
    background: '#ffffff',
    text: '#111827'
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
  typography: { base: 16 }
};

Where to style:

Atomic UI primitives -> src/components/* (CSS Modules or styled files)

Page layout -> src/styles/layouts/


Accessibility note: all colors must include contrast tokens. Provide a color-contrast util.


---

Routing & Pages

Router bootstrap: src/app/Router.tsx or src/app/App.tsx.

Guarding routes: provide an AuthGuard HOC or component to wrap secure routes.

Lazy loading: always lazy-load heavy pages with React.lazy() + Suspense and fallback skeleton components.

Route registration pattern (example):

// src/app/routes.tsx
export const routes = [
  { path: '/', element: <HomePage />, exact: true },
  { path: '/profile/:id', element: <ProfilePage />, auth: true },
];

Where to add a route:

1. Create src/pages/<PageName>/index.tsx and src/features/<feature>/ as needed.


2. Add route entry to src/app/routes.tsx.


3. Add unit and e2e tests.




---

Testing Strategy (unit / integration / e2e / visual)

Unit testing: Jest + React Testing Library. Each component has __tests__ next to it.

Example unit test:

import { render, screen } from '@testing-library/react';
import { UserCard } from '../UserCard';

test('renders user name', () => {
  render(<UserCard id='1' name='Jane' />);
  expect(screen.getByText('Jane')).toBeInTheDocument();
});

Integration tests: test component + slice interactions using mocked store.

E2E: Cypress with cypress/integration/<feature>.spec.ts and fixtures under cypress/fixtures/.

Visual regression: Storybook + Chromatic or Percy. Each component must have at least one story.

Test coverage: aim for meaningful coverage—critical modules 90%, general 70%.


---

Accessibility & Internationalization

Accessibility:

All interactive elements must have accessible names.

Use semantic HTML and landmark roles.

Include a11y automated checks in CI (axe-core).


I18n:

Centralized i18n keys src/i18n/ using react-intl or i18next.

Avoid inline strings in components — always reference translation keys.



---

Performance, Monitoring & Error Handling

Performance:

Lazy-load non-critical routes and components.

Use code-splitting and bundle analysis (source map explorer) in CI.

Avoid heavy computations on render — prefer useMemo / web workers.


Monitoring / Logging:

Use Sentry or similar. Wrap top-level ErrorBoundary and instrument network errors.

Standardize telemetry events (analytics) in src/services/analytics.ts.


Runtime errors:

Provide error boundary UI. For API-timeout, show standard global error snackbar.



---

Security & Secrets

Token storage: store auth tokens in memory + refresh via http-only secure cookies where possible.

Sanitize user input before rendering HTML.

CSP: include content-security-policy configuration from infra.

Secrets: store in CI secret store; do not commit .env files. Provide .env.example with placeholders.



---

Local Developer Environment & Scripts

Important files: .env.example, package.json scripts, .vscode/settings.json

Common scripts:

npm run start        # dev server
npm run build        # production build
npm run test:unit    # jest
npm run test:e2e     # cypress
npm run storybook    # storybook
npm run lint         # eslint

VS Code recommendations:

Extensions: ESLint, Prettier, Tailwind CSS IntelliSense, Jest

Workspace settings to autoformat and set ESLint as formatter


Docker dev container (optional): include a devcontainer.json that defines node version, tooling.


---

CI / CD & Preview Envs

Workflow requirements: every PR must run lint, unit tests, build, storybook snapshot, and e2e smoke tests. Provide a preview environment per PR (Netlify/Vercel/GH Actions) with preview URL in PR.

Secrets: store in repo secrets; use ephemeral preview env vars for PRs.

Workflow example (high level):

1. PR opened -> run lint, test:unit, build, storybook -> publish preview -> comment preview URL on PR.


2. Merge to main -> run build -> deploy to prod.




---

Release, Versioning & Changelog

Use semantic versioning. Tag releases vMAJOR.MINOR.PATCH.

Maintain CHANGELOG.md with entries per PR (generated via conventional commits or auto-changelog).



---

Code Review & PR Checklist (checklist for Copilot)

Pre-PR:

[ ] Branch name follows feature/<short-name> or bugfix/<short-name>.

[ ] Commit messages use Conventional Commits.

[ ] All unit tests pass locally.


PR checklist:

[ ] PR description contains user story (acceptance criteria) and screenshots or GIFs for UI changes.

[ ] Adds/updates tests that cover new behavior.

[ ] Storybook story added/updated for visual review.

[ ] Linting and formatting pass.

[ ] No secrets committed.

[ ] Accessibility checks added for changes affecting UI.


Copilot-specific note: When Copilot proposes code edits, ensure it includes tests and storybook story; otherwise reject or request those additions.


---

Feature Playbook — step-by-step (how Copilot should add features)

Use this as the authoritative checklist Copilot follows when asked to add a feature.

1. Receive feature spec (user story + acceptance criteria). The spec must include:

UI mock or description

API requirements (endpoint, method, sample requests/responses)

State needs (local vs global)

Routing changes (if any)



2. Scaffold files:

New feature -> src/features/<feature>/ with ui/, hooks/, api.ts, slice.ts, index.ts.

Page route -> src/pages/<FeaturePage>/index.tsx

Shared reusable components -> src/components/<Name>/



3. Wire API: add typed client function(s) in api.ts.


4. Add state: implement RTK slice if state needs to be shared; export selectors.


5. Add UI: implement component(s) with typed props and JSDoc.


6. Storybook: add stories for new components.


7. Tests: add unit tests for components and slice, and an e2e test skeleton.


8. Update routes: add route entry and guard if needed.


9. Update docs & manifest: update COMPONENT.md / documentation-manifest.json.


10. Create PR: include changelog entry and follow PR checklist.



> Acceptance Gate: all of the above steps must be present in the PR for it to be considered complete.




---

Copilot Interaction Templates & Examples

Purpose: concrete prompts and policies so Copilot writes code in the right place and follows style rules.

A. Top-level feature prompt (example)

// CONTEXT: repo root, open files: src/app/routes.tsx, src/features/
// REQUEST: Add a "Notifications" feature with following behavior:
// - A /notifications page that lists notifications via GET /notifications
// - Feature should live in src/features/notifications/
// - Export a NotificationList component in src/components/NotificationList/
// - Use an RTK slice for state
// - Add storybook story: Notifications/List
// - Add unit tests for slice and component

// COPILOT: create files, update routes.tsx, and produce PR-ready code. Include JSDoc and tests.

B. Inline file-edit prompt (useful when a specific file is open in the editor)

Place this at the top of a file you want Copilot to edit, e.g., src/features/notifications/api.ts:

/*
COPILOT: Implement fetchNotifications(page:number) -> returns typed NotificationsListResponse.
- Use apiClient from src/services/apiClient.ts
- Throw normalized error { message, code }
*/

C. Test-first prompt

// Add a unit test for NotificationsList component to assert it renders 3 items when store has 3 notifications.
// Create test in src/features/notifications/__tests__/NotificationsList.test.tsx

D. Component template prompt (for consistent components)

// Create a presentational component at src/components/InfoBadge/index.tsx
// requirements:
// - typed props { label: string; value?: string}
// - aria-role present
// - storybook story InfoBadge/Default
// - unit tests

Tips for copilot prompts:

Always include exact target path(s) and filenames.

Include COPILOT: directive comments in files to scope changes.

Prefer smaller tasks (add component A, then wire state B) rather than "do everything" in one go.



---

Scaffolding & Automation (plop/CLI generators)

Rationale: generate consistent files (component + story + test + styles) with a generator.

Recommended setup: use plop or a simple Node script. Generator should produce:

index.tsx component boilerplate

index.module.css or styled file

index.stories.tsx story

__tests__/ unit test

COMPONENT.md metadata

update documentation-manifest.json


Example plop actions: (describe actions — generator code not included here)


---

Troubleshooting / Common Gotchas

404 from API in dev — ensure REACT_APP_API_BASE in .env and CORS allowed on API.

Type errors in CI but not local — check Node/TS versions in CI and skipLibCheck config.

Storybook mismatch — ensure stories import from the correct path (barrels index.ts).

Slow builds — investigate large imports; prefer dynamic imports for heavy libs.



---

Appendix — Code Templates & Manifest format

1) Minimal Component Boilerplate (TypeScript)

// src/components/Button/index.tsx
import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Button
 * Primary button used across the app.
 */
export const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {
  return (
    <button aria-disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

2) Minimal Feature API template

// src/features/todos/api.ts
import apiClient from 'src/services/apiClient';
import type { Todo, TodosResponse } from 'src/features/todos/types';

export async function fetchTodos(page = 1): Promise<TodosResponse> {
  const res = await apiClient.get(`/todos?page=${page}`);
  return res.data as TodosResponse;
}

3) Minimal RTK slice template

// src/features/todos/slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTodos } from './api';

export const loadTodos = createAsyncThunk('todos/load', async (page:number) => {
  return fetchTodos(page);
});

const slice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadTodos.pending, state => { state.loading = true; });
    builder.addCase(loadTodos.fulfilled, (state, action) => { state.items = action.payload.items; state.loading = false; });
  }
});

export default slice.reducer;

4) Documentation Manifest (JSON) — documentation-manifest.json

Maintain a machine-readable manifest mapping exports to files. Useful for Copilot to locate files.

{
  "components": {
    "UserCard": "src/components/UserCard/index.tsx",
    "Button": "src/components/Button/index.tsx"
  },
  "features": {
    "todos": {
      "slice": "src/features/todos/slice.ts",
      "api": "src/features/todos/api.ts",
      "ui": "src/features/todos/ui/"
    }
  },
  "routes": {
    "profile": "src/pages/Profile/index.tsx"
  }
}

How to update manifest: your plop generator should append or a small Node script can rescan src/ and update manifest.


---

Final Notes & Next Steps

Add this file to /docs/PROJECT_DOCUMENTATION.md and keep it in sync with the codebase.

Add a documentation-manifest.json generator and a plop scaffolder for consistent files.

Add pre-commit hooks to require COMPONENT.md and story presence for new components.


If you want, I can:

Generate a plopfile.js that scaffolds components + stories + tests.

Generate a Node script to create and update documentation-manifest.json automatically.

Produce a smaller "quickstart" README for new contributors.



---

End of document.



I created a detailed Markdown doc titled React - Copilot-Friendly Project Documentation and put it in the canvas (open it on the right).

Next up — would you like me to:

generate a plopfile (or generator) to scaffold components/pages/tests + update documentation-manifest.json, or

create the Node script that scans src/ and builds documentation-manifest.json automatically, or

produce a compact contributor README.md / onboarding checklist for new devs?


Pick one and I’ll generate it next.

