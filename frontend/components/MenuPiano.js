import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const destinos = [
  ["Inicio", "/#inicio"], ["Proyectos", "/#proyectos"], ["Perfil", "/#about"],
  ["Experiencia laboral", "/#experiencia"], ["Portafolio", "/proyectos"],
  ["Transcripciones", "/transcripciones"], ["Contacto", "mailto:cgerardo194@gmail.com"],
];

export default function MenuPiano() {
  const [abierto, abrir] = useState(false);
  const menu = useRef(null);
  const boton = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    function cerrarFuera(e) {
      if (!menu.current.contains(e.target)) abrir(false);
    }
    function escapar(e) {
      if (e.key === "Escape") {
        abrir(false);
        boton.current.focus();
      }
    }
    document.addEventListener("pointerdown", cerrarFuera);
    document.addEventListener("focusin", cerrarFuera);
    document.addEventListener("keydown", escapar);
    return () => {
      document.removeEventListener("pointerdown", cerrarFuera);
      document.removeEventListener("focusin", cerrarFuera);
      document.removeEventListener("keydown", escapar);
    };
  }, [abierto]);

  return <div className="menu-piano" ref={menu}>
    <button ref={boton} aria-controls="destinos" aria-expanded={abierto} onClick={() => abrir(!abierto)}>
      <span className="icono-teclas" aria-hidden="true">▮▮▮</span>{abierto ? "Cerrar" : "Menú"}
    </button>
    <nav id="destinos" aria-label="Principal" hidden={!abierto}>
      {destinos.map(([texto, href], i) => {
        const Enlace = href.startsWith("/#") ? "a" : Link;
        return <Enlace key={href} href={href} onClick={() => abrir(false)}
          style={{ "--retardo": i * 25 + "ms" }}>{texto}</Enlace>;
      })}
    </nav>
  </div>;
}
