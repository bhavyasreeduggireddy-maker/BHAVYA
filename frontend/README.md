# CampusPulse frontend

React + Vite frontend styled from the supplied CampusPulse screens in `stitch_campus_event_nexus/`. The browser calls the Render API directly. There is no login or authentication flow.

## Run locally

```bash
npm install
npm run dev
```

The Vite config reads `local.env` and uses `VITE_API_BASE_URL`. Set that variable in the hosting provider when building for deployment; client environment variables are embedded in the static build.

The app has Explore, My Registrations, Organizer Studio, Reports, and API Explorer screens. A profile UUID from the backend `users` table can be saved in this browser to make registration and personal registration-list requests; it is not an account or login.

## Backend API

The configured base URL is `https://bhavya-h47b.onrender.com`. The app calls `/health`, `/api/events`, `/api/events/{id}`, `/api/registrations`, `/api/me/registrations`, and `/api/events/{id}/registrations`.

The backend health check responds, but the current deployed events request returns `permission denied for table events` (HTTP 500). Database access must be granted for the backend's publishable-key role before event data can load. Event creation is not included because the backend has no create-event endpoint.
