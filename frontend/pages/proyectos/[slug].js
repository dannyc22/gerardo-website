import Head from "next/head";
import Link from "next/link";
import { cargar } from "../../lib/api";

export const getServerSideProps = ({ params, res }) => cargar("/api/proyectos/" + encodeURIComponent(params.slug) + "/", res);

export default function Proyecto({ datos: p }) {
  return <article className="obra bloque">
    <Head><title>{p.titulo} · Gerardo Castañeda</title></Head>
    {p.portada && <div className="cubierta"><img src={p.portada} alt={"Imagen de " + p.titulo} /></div>}
    <div><Link href="/proyectos">Volver al portafolio</Link>
      <p className="rotulo">{p.categoria}{p.periodo && " · " + p.periodo}</p>
      <h1>{p.titulo}</h1><h2>{p.formato}</h2><p>{p.descripcion}</p>
      {p.escucha && <a className="accion" href={p.escucha}>Escuchar la obra</a>}
    </div>
  </article>;
}
