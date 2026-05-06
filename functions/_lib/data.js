import raw from "../../mongodb/superhero_characters.json";

export const heroes = Array.isArray(raw) ? raw : raw.characters || [];

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
      ...(init.headers || {}),
    },
  });
}

export function error(status, message) {
  return json({ error: message }, { status });
}
