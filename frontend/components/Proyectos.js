import Link from "next/link";

export function Tarjetas({ proyectos }) {
  return <div className="tarjetas">{proyectos.map(p =>
    <Link key={p.slug} href={"/proyectos/" + p.slug} className="tarjeta">
      {p.portada && <div className="cubierta"><img src={p.portada} alt="" loading="lazy" /></div>}
      <small>{p.categoria}{p.periodo && " · " + p.periodo}</small>
      <h3>{p.titulo}</h3><p>{p.formato}</p>
    </Link>
  )}</div>;
}
