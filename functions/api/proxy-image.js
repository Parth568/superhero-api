const ALLOWED_HOST = "www.superherodb.com";

export async function onRequestGet({ request }) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) return new Response("Missing url param", { status: 400 });

  let parsed;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return new Response("Forbidden", { status: 403 });
  }

  const upstream = await fetch(imageUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!upstream.ok) {
    return new Response("Image not found", { status: upstream.status });
  }

  const headers = new Headers();
  headers.set("content-type", upstream.headers.get("content-type") || "image/jpeg");
  headers.set("cache-control", "public, max-age=86400");
  headers.set("cross-origin-resource-policy", "cross-origin");

  return new Response(upstream.body, { status: 200, headers });
}
