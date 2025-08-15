# Copilot Instructions for AI Agents

## Project Overview
- This is a Vite + React + TypeScript web application for visualizing earthquake data in Spain from the USGS API.
- Tailwind CSS is used for all styling. See `src/index.css` for Tailwind directives.
- Main logic is in `src/App.tsx`, which fetches, filters, sorts, and displays earthquake data.

## Architecture & Data Flow
- Earthquake data is fetched from the USGS API (`https://earthquake.usgs.gov/fdsnws/event/1/query`) using bounding box parameters for Spain and a 50-year date range.
- Data is displayed in a sortable table, with UI controls for filtering by location and refreshing results.
- The app maintains state for earthquake data, loading/error status, filter toggles, and last update timestamp.
- All UI is built with React functional components and hooks (`useState`, `useEffect`).

## Developer Workflows
- **Build/Run:**
  - Use `npm run dev` for local development (hot reload).
  - Use `npm run build` to create a production build.
- **Dependencies:**
  - Tailwind CSS, React, TypeScript, Vite. See `package.json` for details.
- **Linting:**
  - ESLint is configured for TypeScript and React. See `README.md` for advanced config options.
- **Node Version:**
  - Project expects Node.js >= 20.x for Vite compatibility.

## Project-Specific Patterns
- API requests are made directly in React components using `fetch`.
- Filtering for Spain locations is done by checking if `place` includes "Spain" (case-insensitive).
- Sorting is always by magnitude descending.
- Last update timestamp is shown in Spanish locale using `toLocaleString('es-ES', ...)`.
- UI controls (filter, refresh) are grouped at the top of the table for easy access.

## Key Files & Directories
- `src/App.tsx`: Main component, all data logic and UI.
- `src/index.css`: Tailwind CSS setup.
- `.github/instructions/mis_instrucciones_a_la_maquina.instructions.md`: Custom workspace instructions.
- `README.md`: Vite/React/TypeScript setup and ESLint config tips.

## Integration Points
- External API: USGS Earthquake API (see fetch logic in `App.tsx`).
- No backend or server-side code; all logic is client-side.

## Example Patterns
- To add a new filter, use React state and update the table rendering logic.
- To add new columns, update the table in `App.tsx` and extend the Earthquake type.
- For new styles, use Tailwind utility classes in JSX.

---

If any section is unclear or missing, please provide feedback so this guide can be improved for future AI agents.
