export async function cargar(ruta, respuesta) {
  respuesta.setHeader("Cache-Control", "private, no-store");
  const base = process.env.DJANGO_URL || "http://127.0.0.1:8000";
  try {
    const r = await fetch(base + ruta, { signal: AbortSignal.timeout(5000) });
    if (r.status === 404) return { notFound: true };
    if (!r.ok) throw new Error("HTTP " + r.status);
    return { props: { datos: await r.json() } };
  } catch (error) {
    console.error("Error al consultar Django", ruta, error.message, error.cause?.code || "");
    respuesta.statusCode = 503;
    return { props: { error: true } };
  }
}
