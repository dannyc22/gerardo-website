const django = process.env.DJANGO_URL || "http://127.0.0.1:8000";

export default {
  devIndicators: false,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: false },
      { source: "/proyectos.html", destination: "/proyectos", permanent: false },
    ];
  },
  async rewrites() {
    return [{ source: "/muestras/:ruta*", destination: django + "/muestras/:ruta*/" }];
  },
};
