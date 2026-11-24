import { useState } from "react";
import Head from "next/head";
import { cargar } from "../../lib/api";
import { Tarjetas } from "../../components/Proyectos";

export const getServerSideProps = ({ res }) => cargar("/api/proyectos/", res);

export default function Portafolio({ datos }) {
  const [categoria, elegir] = useState("Todos");
  const categorias = ["Todos", ...new Set(datos.map(p => p.categoria))];
  return <section className="bloque archivo"><Head><title>Portafolio · Gerardo Castañeda</title></Head>
    <h1>Portafolio musical</h1>
    <div className="filtros" aria-label="Categorías">{categorias.map(c =>
      <button key={c} aria-pressed={c === categoria} onClick={() => elegir(c)}>{c}</button>)}</div>
    {datos.length ? <Tarjetas proyectos={datos.filter(p => categoria === "Todos" || p.categoria === categoria)} /> : <p>Todavía no hay proyectos publicados.</p>}
  </section>;
}
