import { heroes, json, error } from "../../../_lib/data.js";

export function onRequestGet({ params }) {
  const id = String(params.id || "");
  const hero = heroes.find((h) => String(h.id) === id);
  if (!hero) return error(404, `Hero #${id} not found`);
  return json(hero);
}
