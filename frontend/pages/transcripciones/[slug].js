import Head from "next/head";
import { cargar } from "../../lib/api";

export const getServerSideProps = ({ params, res }) =>
  cargar("/api/transcripciones/" + encodeURIComponent(params.slug) + "/", res);

export default function Ficha({ datos: obra }) {
  const asunto = encodeURIComponent("Solicitud de partitura · " + obra.titulo);
  return <>
    <Head><title>{obra.titulo} · Gerardo Castañeda</title></Head>
    <p className="tipo">Transcripción{obra.demostracion && " · Demostración"}</p>
    <h1>{obra.titulo}</h1><p>{obra.descripcion}</p>
    <div className="ficha">
      <figure><figcaption>Primera página</figcaption><img src={obra.imagen} alt={"Primera página de la partitura «" + obra.titulo + "»"} /></figure>
      <aside><h2>Escuchar fragmento</h2><audio controls preload="none" src={obra.audio} aria-label={"Fragmento de " + obra.titulo} />
        <h2>Partitura completa</h2><a className="boton" href={"mailto:" + obra.correo + "?subject=" + asunto}>Solicitar partitura</a>
        {obra.demostracion && <p className="nota">Contacto de demostración. El correo abre un borrador de prueba.</p>}
      </aside>
    </div>
  </>;
}
