from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify
from obras.models import Proyecto

# Material del portafolio de David Gerardo Castañeda, edición 2026, páginas 5–9 y 13–14.
OBRAS = [
    ("Flotando", "Arreglo", "Estudiantina", "Septiembre 2025",
     "Jhon Edison Montenegro Herrera, compositor de la obra y director de la estudiantina de la Universidad Sergio Arboleda, encargó este arreglo para el conjunto. Fue concebido con miras al Festival de la Rumba Criolla de Fusagasugá.",
     "https://soundcloud.com/david-castaneda-324510772/flotando-final"),
    ("Amalia", "Arreglo", "Trío típico andino", "Julio 2025",
     "El pasillo de Joaquín Arias toma nuevos colores en este arreglo para trío. Gerardo explora polirritmias y superestructuras armónicas en una versión escrita para grabar en vivo.",
     "https://soundcloud.com/david-castaneda-324510772/amalia"),
    ("Kairos", "Composición", "Set de percusión", "Octubre 2025",
     "Tres congas, un ride, tres jam blocks y una campana sostienen el discurso de esta pieza. La escritura explora los aires cubanos de la salsa y el jazz latino a través del ritmo.", ""),
    ("A mi", "Composición", "Bambuco para piano", "Agosto 2025",
     "Bambuco de Gerardo que combina recursos tradicionales y contemporáneos de la música andina colombiana. Participó en la categoría de obra inédita del Festival de Música Colombiana Fabio Alberto Ramírez en Manizales.",
     "https://youtu.be/AbrE0sg_EU8"),
    ("The days of wine and roses", "Arreglo", "Piano solista y big band", "Diciembre 2024",
     "Adaptación del estándar de jazz para piano solista y big band. El arreglo explora el timbre de cada sección y las técnicas instrumentales propias del formato.",
     "https://soundcloud.com/david-castaneda-324510772/the-days-of-wine-and-roses"),
    ("IROKO", "Agrupación", "Música para eventos", "",
     "Agrupación y empresa musical que reúne distintos formatos para celebraciones y eventos.", ""),
    ("Deleite Carranguero", "Agrupación", "Música carranguera", "",
     "Gerardo toca el tiple en esta agrupación de música carranguera, tropical y parrandera. Su recorrido incluye Al Son de las Olas en México y el Concurso Nacional Florito de Oro en Vélez, Santander.", ""),
]


class Command(BaseCommand):
    help = "Incorpora los proyectos del portafolio de 2026 conservando las ediciones locales."

    @transaction.atomic
    def handle(self, *args, **options):
        creados = 0
        for orden, (titulo, categoria, formato, periodo, descripcion, escucha) in enumerate(OBRAS):
            slug = slugify(titulo)
            proyecto, nuevo = Proyecto.objects.get_or_create(slug=slug, defaults=dict(
                titulo=titulo, categoria=categoria, formato=formato, periodo=periodo,
                descripcion=descripcion, escucha=escucha, orden=orden, publicado=True))
            if nuevo:
                nombre = f"{slug}.jpg"
                with (settings.BASE_DIR / "portafolio" / nombre).open("rb") as archivo:
                    proyecto.portada.save(nombre, File(archivo))
                creados += 1
        self.stdout.write(f"Proyectos incorporados: {creados}.")
