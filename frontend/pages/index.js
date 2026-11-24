import Head from "next/head";
import Link from "next/link";
import { cargar } from "../lib/api";
import { Tarjetas } from "../components/Proyectos";

export async function getServerSideProps({ res }) {
  const respuesta = await cargar("/api/proyectos/", res);
  return { props: { proyectos: respuesta.props?.datos?.slice(0, 3) || [], fallo: !!respuesta.props?.error } };
}

const trayectoria = [
  ["2018–2023", "Albor Big Band", "Piano · Jazz"],
  ["2023–2025", "Orquesta Tierra Querida", "Piano y arreglos · Música tropical, salsa y merengue"],
  ["2023–2024", "Titicó Ensamble", "Piano y dirección · Jazz latino y salsa"],
  ["2024–2025", "Los Esmeralderos Salsa", "Piano · Salsa brava y son cubano"],
];

export default function Portada({ proyectos, fallo }) {
  return <>
    <Head><title>Gerardo Castañeda · Piano, composición y arreglos</title></Head>
    <section className="hero" id="inicio">
      <div className="presentacion">
        <p className="rotulo">Pianista · Arreglista · Compositor</p>
        <h1>Gerardo<br /><em>Castañeda</em></h1>
        <p className="entrada">Del bambuco al jazz, una exploración de las músicas de Colombia desde el piano.</p>
        <a className="accion" href="#proyectos">Ver proyectos</a>
      </div>
      <div className="retrato"><img src="/sources/about-me.jpeg" alt="Gerardo sentado al piano de cola" fetchPriority="high" /></div>
    </section>
    <section id="proyectos" className="bloque">
      <div className="encabezado"><h2>Proyectos destacados</h2><Link href="/proyectos">Ver el portafolio</Link></div>
      {proyectos.length ? <Tarjetas proyectos={proyectos} /> : <p>{fallo ? "No se pudo cargar el portafolio." : "Todavía no hay proyectos publicados."}</p>}
    </section>
    <section className="perfil bloque" id="about">
      <img src="/sources/mainpage.jpeg" loading="lazy" alt="Gerardo interpretando el teclado" />
      <div><p className="rotulo">Perfil</p><h2>Entre el piano y el tiple</h2>
        <p>David Gerardo Castañeda es pianista, arreglista y compositor bogotano, con raíces en Boyacá y Santander. A los doce años comenzó a estudiar piano clásico en la Universidad Sergio Arboleda y complementó su formación con talleres de Yamaha.</p>
        <p>En 2017 participó en la fundación de Albor Big Band. El encuentro con el jazz latino lo llevó a profundizar en composición y arreglos. Su escritura reúne ritmos andinos colombianos y armonías contemporáneas.</p>
      </div>
    </section>
    <section className="bloque experiencia"><h2>Trayectoria musical</h2>
      <dl>{trayectoria.map(([fecha, grupo, rol]) => <div key={grupo}><dt>{fecha}</dt><dd><strong>{grupo}</strong><span>{rol}</span></dd></div>)}</dl>
      <details><summary>Festivales, docencia y otras experiencias</summary>
        <p>Al piano participó en el Festival Pianos Yamaha de Bogotá (2016), Tolijazz en Ibagué (2019) y JazzCamp en Manizales (2022). En ECO6, Bogotá (2024), tocó el tiple y el acordeón.</p>
        <p>Fue tiplista con Deleite Carranguero (2023–2025) y acordeonero con Edgar Manuel La Voz Romántica (2023–2024). Su portafolio también recoge la docencia musical preuniversitaria desde 2023 y su participación como asistente y jurado en evaluaciones de piano jazz de la Universidad Sergio Arboleda.</p>
      </details>
    </section>
  </>;
}
