Koto App - A cozy place to create, store and share prompts and web tools.

**Overview**
- Koto is a personal workspace for collecting AI prompts and handy web tools, organizing them into projects/stacks, and sharing them publicly when you choose. It aims to feel calm, fast, and “cozy” while covering the essentials you need to ideate, save, retrieve, and publish.

**What It Does**
- **Create + capture**: Add AI prompts (optionally with cover images) and web tools (with URL, favicon, and description auto‑fill).
- **Organize**: Group content by top‑level projects (Prompts) and stacks (Tools), with subprojects/substacks. Drag & Drop cards into projects/subprojects to re‑organize.
- **Browse + search**: Filter by project/stack or subcategory and search by title/tags/name.
- **Share**: Toggle any prompt/tool Public or Private. Generate share links with tokens; publish a public profile that aggregates all public items.
- **Cross‑device**: Responsive UI with a dedicated mobile experience mirroring desktop concepts and data.

**How It Works**
- **Frontend**: React + Vite + TypeScript. UI is rendered as desktop (KotoDashboard) or mobile (MobileDashboard) based on screen size. Cards render in a clean masonry layout with consistent gutters.
- **State + persistence**:
  - App state lives client‑side (React). Frequently used choices persist in `localStorage`:
    - Desktop: `koto_active_tab`, `koto_active_category_prompts`, `koto_active_category_tools`
    - Mobile: `koto_mobile_active_tab`, `koto_mobile_active_category_prompts`, `koto_mobile_active_category_tools`
  - Drag & Drop instantly updates local state and then persists to DB; on failure, state is reverted.
- **Backend**: Supabase Postgres + Auth + Storage + Realtime.
  - CRUD for prompts, tools, categories, and subcategories lives in `src/lib/data.ts`.
  - OAuth via Supabase (GitHub/Google). Sessions persist client‑side.
  - Cover and avatar images use Supabase Storage with public URLs.
  - Realtime subscriptions keep categories/subcategories lists fresh across tabs/devices.
- **Visibility & sharing**:
  - Every prompt/tool has `is_public` that can be toggled in the Details modal (always visible, edit‑free quick toggle).
  - Share links use one‑time tokens stored with the item (`share_token`).
  - Public profile pages render a user’s public prompts and tools.

**For Whom**
- **Indie makers & designers** capturing prompts and references while experimenting.
- **Developers** organizing internal prompts, scripts, and tool links for projects.
- **Agencies/teams** needing a lightweight, shareable library of prompts and tools.
- **Anyone** who wants an uncluttered place to save, categorize, and optionally publish their prompt/tool library.

**App Specs**
- **Tech Stack**
  - React 19, TypeScript, Vite 6, Tailwind CSS v4, Framer Motion, lucide‑react icons.
  - Supabase JS v2 (Auth, Database, Storage, Realtime).
  - Deployed on Vercel with SPA rewrites (`vercel.json`).

- **Core Data Model (simplified)**
  - `user_profiles`: id, username, display_name, avatar_url, profile_public
  - `prompts`: id, user_id, title, content, model, tags[], category (category id), subcategory (nullable), cover_image, is_public, share_token, created_at
  - `tools`: id, user_id, name, url, description, favicon, category (category id), subcategory (nullable), is_public, share_token, created_at
  - `categories`: id, user_id, name, icon (string name), type ('prompt'|'tool'), created_at
  - `subcategories`: id, user_id, name, category_id, created_at
  - Storage buckets: `covers/` for prompt covers, `avatars/` for profile images.

- **Key UX Behaviors**
  - **Projects/Stacks**: top‑level grouping for prompts/tools. Subcategories nest under these.
  - **Drag & Drop**: move cards between categories/subcategories (DB updates persist immediately).
  - **Masonry lists**: consistent card gutters; variable card heights; responsive columns.
  - **Details Modals**: quick actions (Copy, Share, Delete) and a **Public/Private toggle** always visible.
  - **Auto‑fill tools**: pasting a URL detects domain, sets name/favicon, and smart description for common sites.
  - **Mobile parity**: Project/Stack drawer includes counts, subcategories, and DB‑backed create/rename/delete.
  - **Tab/category persistence**: remembers your last tab and category per tab across reloads.

- **Routing (client‑side)**
  - `/` responsive root (desktop or mobile UI)
  - `/app` desktop UI
  - `/mobile` mobile UI (opt‑in)
  - `/auth/callback` OAuth callback handler
  - `/shared/prompt?token=...`, `/shared/tool?token=...` public share pages
  - `/profile/:username` public profile page

- **Environment Variables**
  - `VITE_SUPABASE_URL` (accepts full URL, domain, or project ref – normalized at runtime)
  - `VITE_SUPABASE_ANON_KEY`

- **Build & Deploy**
  - `yarn build` → TypeScript build + Vite build
  - Vercel picks up `index.html` and serves as SPA (rewrites all routes to `/`).
  - Production sourcemaps enabled for debugging.

- **Security & Privacy**
  - Auth via Supabase OAuth with persisted sessions.
  - Private items never appear on public endpoints or profiles.
  - Share links are tokenized; possession of token grants read‑only access to the shared item.

- **Known Limits/Quirks (v1)**
  - Public profile shows only items where `is_public = true`.
  - Real‑time subscriptions are focused on categories/subcategories; items update via CRUD flows.
  - Drag & Drop is desktop‑oriented; mobile re‑organization happens via controls rather than drag.

**User Flows (Happy Paths)**
- **Add a prompt**: Click Add Prompt → fill title/content/tags/model → optional cover image (upload or paste) → choose project/subproject → Save. Toggle Public when ready.
- **Add a tool**: Click Add Tool → paste URL → auto‑fills name/favicon/description → choose stack/substack → Save. Toggle Public when ready.
- **Reorganize**: Drag a card onto a project or subcategory in the sidebar to move it (persists to DB).
- **Share**: Open Details → Copy share link or toggle Public to include it in profile.

**Code Map (selected)**
- `src/components/generated/KotoDashboard.tsx` — desktop app shell, lists, drag‑and‑drop, details modals (tools inline).
- `src/components/MobileDashboard.tsx` — mobile UI parity with drawer‑based navigation and counts.
- `src/components/generated/PromptDetailsModal.tsx` — prompt details, quick visibility toggle, copy/share/delete.
- `src/components/generated/PromptCard.tsx` & `ToolCard.tsx` — masonry‑friendly cards with drag handles.
- `src/lib/data.ts` — typed Supabase client calls for CRUD, sharing, subscriptions, and uploads.
- `src/lib/supabaseClient.ts` — Supabase init with URL normalization and session options.

**Seeds for v2 Ideation**
- Explore page surfacing public prompts/tools with discovery filters (tags, popularity, recency).
- Collaboration: shared workspaces/teams and role‑based permissions.
- Versioning for prompts/tools; drafts and publishing workflow.
- Rich prompt editor with templates, variables, and test runs.
- Bulk operations (multi‑select, move, tag, visibility).
- Advanced search: semantic search and tag suggestions.
- Analytics on public items (views, copies, saves).

— End of Koto v1 Overview —

