---
description: How to manage version releases and task overview documentation.
---

# Release Management Workflow

Follow these steps to maintain structured releases and clear documentation.

## 1. Branch Management
- **Develop Branch**: All feature development should be merged into `develop`.
- **Main Branch**: Only production-ready code should be merged into `main`.
- Use feature branches (e.g., `feat-dynamic-routing`) and delete them after successful merge to `develop`.

## 2. Documenting Changes
- After completing a task, update the local `task_overview.md` in the project root.
- Add entries under the `## Release Notes` section or appropriate version header.
- Use the following categories:
  - `[Added]` for new features.
  - `[Changed]` for refactors or architecture updates.
  - `[Fixed]` for bug fixes.

## 3. Tool Utilization
- Use the `task_overview.md` as the source of truth for the project's current status and backlog.
- Ensure any global refactors (like naming changes) are communicated via this document.
