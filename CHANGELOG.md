\# Changelog



All notable changes to this project will be documented in this file.



\## \[ui-rc5-polish] - 2025-09-10

\### Changed

\- Equalized heights of input/output panes and added independent internal scrolling.

\- Removed sticky behavior from output section header to prevent overlap with the site Header.

\- Moved “Copy” button to the bottom of the output pane; remains accessible after scrolling.

\- Aligned “Compose prayer” with the “Show anchor” toggle to prevent overlap on smaller viewports.

\- Reduced vertical gap between the site Header and page content.



\### Fixed

\- Output pane previously sliding underneath the main Header.

\- Nested/duplicated `<button>` markup that caused compile errors.



\### Notes

\- Tag: `ui-rc5-polish` (commit `c9ac364`)

\- Built and verified locally (ports 3000/3001).



\## \[v0.1.0-frontend-integration]

\### Added

\- Initial Next.js + Tailwind + TypeScript scaffold.

\- Health check page (`/health`) and seed page (`/seed`).

\- Frontend connected to backend endpoints (`/dhll/compose`, `healthz`, `map`).

\- Tag: `v0.1.0-frontend-integration`.



