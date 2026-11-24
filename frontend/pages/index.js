import Head from "next/head";
import Link from "next/link";
import { cargar } from "../lib/api";
import { useEffect, useRef } from "react";
import CarruselProyectos from "../components/CarruselProyectos";

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

function EnlaceInferior({ href, children }) {
  return <a className="bajar" href={href}>{children} <span aria-hidden="true">↓</span></a>;
}

export default function Portada({ proyectos, fallo }) {
  const pagina = useRef(null);
  useEffect(() => {
    const raiz = pagina.current;
    const secciones = Array.from(raiz.querySelectorAll(":scope > section"));
    let cuadro = 0;
    let sincronizarFragmento = false;
    function actualizarEnfoque() {
      cuadro = 0;
      const alto = window.innerHeight;
      const inicio = raiz.getBoundingClientRect().top;
      let destino = "inicio";
      const desenfoques = secciones.map((seccion, i) => {
        const rect = seccion.getBoundingClientRect();
        if (i > 0 && rect.top <= alto / 2) destino = seccion.id;
        // Una sección larga sigue enfocada mientras se recorre su contenido.
        const distancia = i === 0 ? -inicio : Math.max(rect.top, alto - rect.bottom);
        return Math.min(1, Math.max(0, distancia / alto)) * 16;
      });
      if (sincronizarFragmento && location.hash !== "#" + destino) {
        history.replaceState(history.state, "", "#" + destino);
      }
      secciones.forEach((seccion, i) => {
        const valor = desenfoques[i].toFixed(2) + "px";
        if (seccion.style.getPropertyValue("--desenfoque") !== valor) {
          seccion.style.setProperty("--desenfoque", valor);
        }
      });
    }
    function programar() {
      if (!cuadro) cuadro = requestAnimationFrame(actualizarEnfoque);
    }
    function alDesplazar() {
      sincronizarFragmento = true;
      programar();
    }
    actualizarEnfoque();
    const cambios = new ResizeObserver(programar);
    secciones.forEach(seccion => cambios.observe(seccion));
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", programar);
    return () => {
      cambios.disconnect();
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", programar);
    };
  }, []);
  return <div ref={pagina} className="portada" id="inicio">
    <Head><title>Gerardo Castañeda · Piano, composición y arreglos</title></Head>
    <section className="apertura">
      <div className="nombre-artista">
        <h1><span>Gerardo</span> <em>Castañeda</em></h1>
        <p><span className="solo-lectores">Pianista</span><span aria-hidden="true" className="palabra-notas">
          {Array.from("Pianista", (letra, i) => <span key={i} style={{ "--orden": i }}>{letra}</span>)}
        </span><span className="resto-subtitulo"> - arreglista - compositor</span></p>
      </div>
      <EnlaceInferior href="#proyectos">Ver proyectos</EnlaceInferior>
    </section>
    <section id="proyectos" className="bloque">
      <div className="encabezado"><h2>Proyectos destacados</h2><Link href="/proyectos">Ver el portafolio</Link></div>
      {proyectos.length ? <CarruselProyectos proyectos={proyectos} /> : <p>{fallo ? "No se pudo cargar el portafolio." : "Todavía no hay proyectos publicados."}</p>}
      <EnlaceInferior href="#about">Ver perfil</EnlaceInferior>
    </section>
    <section className="perfil bloque" id="about">
      <img src="/sources/mainpage.jpeg" loading="lazy" alt="Gerardo interpretando el teclado" />
      <div><p className="rotulo">Perfil</p><h2>Pues aqui toca poner el titulo js</h2>
        <p>David Gerardo Castañeda es pianista, arreglista y compositor bogotano, con raíces en Boyacá y Santander. A los doce años comenzó a estudiar piano clásico en la Universidad Sergio Arboleda y complementó su formación con talleres de Yamaha.</p>
        <p>En 2017 participó en la fundación de Albor Big Band. El encuentro con el jazz latino lo llevó a profundizar en composición y arreglos. Su escritura reúne ritmos andinos colombianos y armonías contemporáneas.</p>
      </div>
      <EnlaceInferior href="#experiencia">Ver experiencia laboral</EnlaceInferior>
    </section>
    <section className="bloque experiencia" id="experiencia"><h2>Experiencia laboral</h2>
      <dl>{trayectoria.map(([fecha, grupo, rol]) => <div key={grupo}><dt>{fecha}</dt><dd><strong>{grupo}</strong><span>{rol}</span></dd></div>)}</dl>
      <details><summary>Festivales, docencia y otras experiencias</summary>
        <p>Al piano participó en el Festival Pianos Yamaha de Bogotá (2016), Tolijazz en Ibagué (2019) y JazzCamp en Manizales (2022). En ECO6, Bogotá (2024), tocó el tiple y el acordeón.</p>
        <p>Fue tiplista con Deleite Carranguero (2023–2025) y acordeonero con Edgar Manuel La Voz Romántica (2023–2024). Su portafolio también recoge la docencia musical preuniversitaria desde 2023 y su participación como asistente y jurado en evaluaciones de piano jazz de la Universidad Sergio Arboleda.</p>
      </details>
    </section>
  </div>;
}
