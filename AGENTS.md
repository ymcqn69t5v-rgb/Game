# Nimbus HQ — Codex instructions

## Product goal
Build a focused internal workspace for a Czech small business. It replaces scattered chats, task lists and documents. It is not a full Microsoft Teams clone and must not add video conferencing.

## MVP scope
- Authentication and roles: owner, admin, employee, external.
- Dashboard with personal tasks, announcements, project progress and deadlines.
- Public/private channels, direct messages, threads and attachments.
- Projects, memberships, tasks, comments and Kanban states.
- Documents with folders and access control.
- Announcements with optional acknowledgement.
- Calendar events.
- People directory and admin management.
- Czech user interface; code and database identifiers remain English.

## Architecture
- Next.js App Router, TypeScript strict mode, React, Tailwind CSS.
- Supabase Auth, Postgres, Realtime and Storage.
- Server components by default. Client components only for interaction.
- Row Level Security is mandatory. Never trust role or user IDs from the client.
- Keep demo mode only until Supabase-backed flows are implemented.

## Quality gates
Before proposing a PR, run `npm run typecheck`, `npm run lint`, and `npm run build`.
Do not commit secrets. Update `.env.example` when adding configuration.
