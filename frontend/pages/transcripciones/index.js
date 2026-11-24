import Link from "next/link";
import { cargar } from "../../lib/api";

export const getServerSideProps = ({ res }) => cargar("/api/transcripciones/", res);

export default function Indice({ datos }) {
  return <><h1>Transcripciones</h1>{datos.length ? <ul>{datos.map(obra =>
    <li key={obra.slug}><Link href={"/transcripciones/" + obra.slug}>{obra.titulo}</Link>{obra.demostracion && " · Demostración"}</li>
  )}</ul> : <p>Todavía no hay transcripciones publicadas.</p>}</>;
}
