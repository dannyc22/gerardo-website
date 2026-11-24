# Gerardo Castañeda · Portafolio musical

La portada, el catálogo y las fichas se renderizan en Next.js. Django Admin gestiona proyectos y transcripciones en SQLite. Las cinco obras y dos agrupaciones proceden del portafolio de 2026 de Gerardo. Las imágenes para la importación están en backend/portafolio. La plantilla y los PDF originales se conservan en la carpeta hermana Gerardo.

## Iniciar en local

Desde la raíz del repositorio, con Python 3.12 y Node.js 22.13 o posterior, abre dos terminales. En la primera prepara Django y crea tus credenciales cuando el comando las pida. En los siguientes arranques basta con la última línea.

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r backend/requirements.txt
.venv/bin/python backend/manage.py migrate
.venv/bin/python backend/manage.py cargar_portafolio
.venv/bin/python backend/manage.py cargar_demo
.venv/bin/python backend/manage.py createsuperuser
.venv/bin/python backend/manage.py runserver 127.0.0.1:8000
```

En la segunda terminal ejecuta lo siguiente. En los arranques posteriores basta con entrar en frontend y ejecutar npm run dev.

```sh
cd frontend
npm ci
npm run dev
```

Abre la [ficha de demostración](http://127.0.0.1:3000/transcripciones/estudio-de-demostracion), la [portada](http://127.0.0.1:3000/), el [índice](http://127.0.0.1:3000/transcripciones) o el [panel](http://127.0.0.1:8000/admin/). Si cambias el puerto de Django, copia frontend/.env.example a frontend/.env.local, ajusta DJANGO_URL y reinicia Next.js.

## Editar el portafolio

En el panel, abre Obras → Proyectos. Puedes editar la descripción, carátula, categoría, formato, fecha y enlace de escucha. La portada destaca los primeros tres proyectos publicados según el campo Orden. El catálogo en /proyectos muestra todos y permite filtrar por categoría. Al desmarcar Publicado, se retiran también el detalle en /api/proyectos/IDENTIFICADOR/ y su imagen. El comando cargar_portafolio conserva los registros existentes con el mismo identificador.

## Publicar y comprobar una transcripción

1. En el panel abre Obras → Transcripciones → Añadir. Introduce el título y conserva el identificador generado o elige uno propio. Guarda con «Publicada» desmarcada.
2. Abre /api/transcripciones/ en el puerto 8000. La nueva ficha debe faltar en la lista. La dirección /api/transcripciones/IDENTIFICADOR/ y la página /transcripciones/IDENTIFICADOR en el puerto 3000 deben responder 404.
3. En el panel añade una descripción, la primera página en PNG o JPEG, un fragmento independiente en MP3 o WAV y el correo de solicitudes. Marca «Publicada» y guarda. El índice enlaza la ficha inmediatamente.
4. Recarga la ficha en una ventana estrecha. Comprueba que puedes leer la imagen, iniciar y pausar el fragmento y abrir un borrador de correo mediante «Solicitar partitura». El equipo necesita una aplicación asociada a los enlaces de correo.
5. Guarda las direcciones de la imagen y del audio. Desmarca «Publicada», guarda y recarga esas direcciones. Ambas deben responder 404, igual que la ficha.

## Datos y archivos

El modelo está en `backend/obras/models.py`, las consultas públicas en `backend/obras/views.py` y el componente que consume el detalle en `frontend/pages/transcripciones/[slug].js`. Django guarda las subidas en `backend/archivos/` y expone únicamente dos rutas de muestra por obra publicada. La partitura completa se conserva por separado y se entrega por el canal de contacto. La base SQLite y las subidas quedan excluidas de Git.

La obra «Estudio de la mañana», su primera página, el fragmento sintetizado y el correo de prueba son de demostración. Para publicar la obra real hacen falta título, descripción o créditos, primera página exportada como imagen, fragmento de audio y correo confirmado. El comando cargar_demo se puede repetir y conserva los cambios de una ficha existente.

## Pruebas y diagnóstico

```sh
(cd backend && ../.venv/bin/python manage.py check && ../.venv/bin/python manage.py test)
(cd frontend && npm run build)
```

| Señal | Dónde mirar y qué comprobar |
| --- | --- |
| 404 en detalle y muestras | En la terminal de Django mira la ruta solicitada. Verifica identificador y casilla «Publicada». |
| 404 solo en una muestra | El aviso «Falta el archivo de …» en Django identifica la obra y el tipo de archivo. Vuelve a subirlo desde el panel. |
| 503 en la ficha | En Next.js busca «Error al consultar Django», la ruta y la causa. ECONNREFUSED indica que no hay servicio escuchando en esa dirección. Revisa DJANGO_URL y el puerto. |
| Error de SQLite «no such table» | En la terminal de Django verifica la migración con manage.py showmigrations y ejecuta manage.py migrate. |
| El panel vuelve al formulario | Revisa los errores junto a cada campo. Para publicar hacen falta la imagen, el fragmento y el correo. |
