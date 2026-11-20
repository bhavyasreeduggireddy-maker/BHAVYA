# Events API

## Deploy on Render

This folder is ready to deploy as the root of a Render web service. If deploying from a larger repository, set the service's **Root Directory** to `backend`.

The included `render.yaml` configures the build command, Gunicorn start command, and `/health` health check. Add these environment variables in the Render dashboard when prompted:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

For local development, copy `.env.example` to `.env` and fill in your Supabase project values. Do not commit `.env`.

## API routes

- `GET /api/events`
- `GET /api/events/<event_id>`
- `POST /api/registrations`
- `GET /api/me/registrations?user_id=<user_id>`
- `GET /api/events/<event_id>/registrations`

The API currently has no authentication, and CORS allows requests from any origin.
