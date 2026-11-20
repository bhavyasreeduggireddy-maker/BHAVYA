import os
from functools import lru_cache

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from postgrest import APIError
from supabase import Client, create_client

load_dotenv()

app = Flask(__name__)


@lru_cache(maxsize=1)
def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_PUBLISHABLE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be set")
    return create_client(url, key)


@app.after_request
def enable_open_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, apikey"
    return response


def database_error(error):
    return jsonify({"error": getattr(error, "message", str(error))}), 500


@app.get("/health")
def health():
    return jsonify({"status": "ok"}), 200


@app.get("/api/events")
def list_events():
    try:
        query = get_supabase().table("events").select("*")
        status = request.args.get("status")
        if status:
            query = query.eq("status", status)
        result = query.execute()
        return jsonify(result.data), 200
    except (APIError, RuntimeError) as error:
        return database_error(error)


@app.get("/api/events/<uuid:event_id>")
def get_event(event_id):
    try:
        result = (
            get_supabase().table("events").select("*").eq("id", str(event_id)).maybe_single().execute()
        )
        if result.data is None:
            return jsonify({"error": "Event not found"}), 404
        return jsonify(result.data), 200
    except (APIError, RuntimeError) as error:
        return database_error(error)


@app.post("/api/registrations")
def create_registration():
    payload = request.get_json(silent=True) or {}
    user_id = payload.get("user_id")
    event_id = payload.get("event_id")
    if not user_id or not event_id:
        return jsonify({"error": "user_id and event_id are required"}), 400

    try:
        db = get_supabase()
        event_result = (
            db.table("events").select("id, capacity, status").eq("id", event_id).maybe_single().execute()
        )
        event = event_result.data
        if event is None:
            return jsonify({"error": "Event not found"}), 404
        if event.get("status") != "open":
            return jsonify({"error": "Event is not open for registration"}), 409

        duplicate = (
            db.table("registrations").select("id").eq("event_id", event_id).eq("user_id", user_id).execute()
        )
        if duplicate.data:
            return jsonify({"error": "Already registered for this event"}), 409

        registrations = db.table("registrations").select("id").eq("event_id", event_id).execute()
        capacity = event.get("capacity")
        if capacity is not None and len(registrations.data) >= capacity:
            return jsonify({"error": "Event is at capacity"}), 409

        created = (
            db.table("registrations")
            .insert({"user_id": user_id, "event_id": event_id})
            .execute()
        )
        return jsonify(created.data[0] if created.data else {}), 201
    except (APIError, RuntimeError) as error:
        # Unique constraints can also reject duplicate registrations.
        message = getattr(error, "message", str(error))
        if "duplicate" in message.lower() or "unique" in message.lower():
            return jsonify({"error": "Already registered for this event"}), 409
        return database_error(error)


@app.get("/api/me/registrations")
def my_registrations():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id query parameter is required"}), 400
    try:
        result = (
            get_supabase()
            .table("registrations")
            .select("*, events(*)")
            .eq("user_id", user_id)
            .execute()
        )
        return jsonify(result.data), 200
    except (APIError, RuntimeError) as error:
        return database_error(error)


@app.get("/api/events/<uuid:event_id>/registrations")
def event_registrations(event_id):
    try:
        event = (
            get_supabase().table("events").select("id").eq("id", str(event_id)).maybe_single().execute()
        )
        if event.data is None:
            return jsonify({"error": "Event not found"}), 404
        result = (
            get_supabase()
            .table("registrations")
            .select("*, users(id, email, role)")
            .eq("event_id", str(event_id))
            .execute()
        )
        return jsonify(result.data), 200
    except (APIError, RuntimeError) as error:
        return database_error(error)


if __name__ == "__main__":
    app.run(debug=True)
