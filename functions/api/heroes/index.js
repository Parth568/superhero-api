import { heroes, json } from "../../_lib/data.js";

export function onRequestGet({ request }) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "200", 10), 1000);

  let result = heroes;
  if (q) {
    result = result.filter(
      (h) => h.name && h.name.toLowerCase().includes(q)
    );
  }
  return json(result.slice(0, limit));
}
