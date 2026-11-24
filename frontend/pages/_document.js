import { Html, Head, Main, NextScript } from "next/document";

// Se ejecuta antes de pintar el documento y antes de que Next lea el fragmento.
const inicioAlRecargar = `
  if (location.pathname === "/" && performance.getEntriesByType("navigation")[0]?.type === "reload") {
    const restauracion = history.scrollRestoration;
    history.scrollRestoration = "manual";
    if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
    window.addEventListener("pageshow", () => {
      window.scrollTo({ top: 0, behavior: "instant" });
      history.scrollRestoration = restauracion;
    }, { once: true });
  }
`;

export default function Document() {
  return <Html lang="es"><Head><script dangerouslySetInnerHTML={{ __html: inicioAlRecargar }} /></Head>
    <body><Main /><NextScript /></body></Html>;
}
