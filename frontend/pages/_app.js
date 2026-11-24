import Link from "next/link";
import Head from "next/head";
import "../styles/ficha.css";
import "../styles/portafolio.css";

export default function App({ Component, pageProps, router }) {
  const esTranscripcion = router.pathname.startsWith("/transcripciones");
  return <>
    <Head><title>Gerardo Castañeda · Archivo musical</title></Head>
    <header className="barra"><Link className="firma" href="/">Gerardo Castañeda</Link>
      <nav aria-label="Principal"><Link href="/proyectos">Proyectos</Link><Link href="/transcripciones">Transcripciones</Link><a href="#contacto">Contacto</a></nav>
    </header>
    <main className={esTranscripcion ? "interior" : "sitio"}>{pageProps.error ? <p className="bloque">El archivo musical no está disponible en este momento.</p> : <Component {...pageProps} />}</main>
    <footer id="contacto"><div><p className="rotulo">Contacto</p><h2>Gerardo Castañeda</h2><p>Bogotá, Colombia</p></div>
      <div><a href="mailto:cgerardo194@gmail.com">cgerardo194@gmail.com</a><a href="tel:+573227738665">+57 322 773 8665</a></div>
      <div><a href="https://www.instagram.com/david_gerardocr/">Instagram</a><a href="https://www.youtube.com/@gerardocastaneda5221">YouTube</a></div>
    </footer>
  </>;
}
