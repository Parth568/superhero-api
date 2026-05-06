import { heroes, json, error } from "../../_lib/data.js";

export function onRequestGet({ params }) {
  const name = decodeURIComponent(String(params.name || "")).toLowerCase();
  const hero = heroes.find(
    (h) => h.name && h.name.toLowerCase() === name
  );
  if (!hero) return error(404, `Hero "${name}" not found`);
  return json(hero);
}
