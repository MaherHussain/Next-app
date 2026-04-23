---
name: zfood-core
description: Core coding standards, architecture patterns, and conventions for the ZFood project.
---

# ZFood Core Standards

This skill defines the requirements and patterns for contributing to the ZFood codebase. All agents must adhere to these standards to maintain project consistency.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TailwindCSS, React Query.
- **Backend**: Next.js API Routes, MongoDB (Mongoose), Socket.IO.
- **State Management**: React Query for server state, local React state for UI.
- **Real-time**: Socket.IO for live order notifications.

## Project Structure & Conventions

### Filename Naming (Kebab-Case)
- All Mongoose models in `src/lib/models/` MUST use kebab-case (e.g., `user.ts`, `order.ts`, `ingredients-group.ts`).
- Services in `src/app/services/` should follow kebab-case (e.g., `order-services.ts`).
- Avoid PascalCase or camelCase for filenames unless they are React components.

### API Standardization
- **Orders**: All order-related logic should be consolidated in `/api/orders` (GET/POST) and `/api/orders/[id]` (GET/PATCH).
- **Ingredients**: Ingredient groups should be nested under `/api/ingredients/groups`.
- Avoid creating ad-hoc top-level directories for functional actions (e.g., use `PATCH /api/orders/[id]` instead of `POST /api/order/accept`).

### DB & Models
- Use the established `dbConnect` utility in `@/lib/mongodb`.
- Ensure `partnerId` is used in the `Restaurant` model to link multiple restaurants to a single partner account.
- Statuses for orders: `pending`, `confirmed`, `cancelled`, `awaiting-admin`, `awaiting-customer`.

### Socket.IO
- Notify the Socket.IO server (typically at `http://localhost:4000`) when key events occur (e.g., new order placed).

## Common Tasks & Workflows
- Refer to `.agent/workflows/manage-release.md` for release management procedures.
- Update `task_overview.md` at the end of each major task to maintain the local project log.
