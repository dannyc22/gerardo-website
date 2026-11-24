import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CarruselProyectos({ proyectos }) {
  const escenario = useRef(null);
  const gesto = useRef(null);
  const [indice, seleccionar] = useState(0);
  const [visible, ver] = useState(false);
  const [reducido, reducir] = useState(true);
  const [leyendo, leer] = useState(false);
  const total = proyectos.length;
  const actual = indice % total;

  useEffect(() => {
    const preferencia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const actualizar = () => reducir(preferencia.matches);
    actualizar();
    preferencia.addEventListener("change", actualizar);
    const observador = new IntersectionObserver(([entrada]) => ver(entrada.isIntersecting));
    observador.observe(escenario.current);
    return () => {
      observador.disconnect();
      preferencia.removeEventListener("change", actualizar);
    };
  }, []);

  useEffect(() => {
    if (!visible || reducido || leyendo || total < 2) return;
    const reloj = setInterval(() => {
      if (!document.hidden) seleccionar(i => (i + 1) % total);
    }, 4000);
    return () => clearInterval(reloj);
  }, [visible, reducido, leyendo, total, indice]);

  function avanzar(paso) {
    seleccionar(i => (i + paso + total) % total);
  }

  function terminarGesto(evento) {
    if (!gesto.current) return;
    const punto = evento.changedTouches[0];
    const dx = punto.clientX - gesto.current.clientX;
    const dy = punto.clientY - gesto.current.clientY;
    gesto.current = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) avanzar(dx < 0 ? 1 : -1);
  }

  return <div className="carrusel" ref={escenario} role="region" aria-label="Carrusel de proyectos destacados">
    <div className="pista" onTouchStart={e => { gesto.current = e.touches[0]; }}
      onTouchEnd={terminarGesto} onTouchCancel={() => { gesto.current = null; }}>
      {proyectos.map((p, i) => <article key={p.slug} className="diapositiva" data-activa={i === actual}
        aria-hidden={i !== actual} inert={i !== actual}>
        {p.portada && <div className="arte"><img src={p.portada} alt={"Carátula de " + p.titulo} /></div>}
        <div className="resumen"><p className="rotulo">{p.categoria}{p.periodo && " · " + p.periodo}</p>
          <h3>{p.titulo}</h3><p>{p.formato}</p>
          <Link href={"/proyectos/" + p.slug} onFocus={() => leer(true)} onBlur={() => leer(false)}>Ver ficha</Link>
        </div>
      </article>)}
    </div>
    {total > 1 && <div className="controles">
      <button aria-label="Proyecto anterior" onClick={() => avanzar(-1)}>‹</button>
      <button aria-label="Proyecto siguiente" onClick={() => avanzar(1)}>›</button>
    </div>}
  </div>;
}
