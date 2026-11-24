from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction
from obras.models import Transcripcion


class Command(BaseCommand):
    help = "Carga una transcripción de demostración publicada."

    @transaction.atomic
    def handle(self, *args, **options):
        slug = "estudio-de-demostracion"
        if Transcripcion.objects.filter(slug=slug).exists():
            self.stdout.write("La ficha ya existe. Se conserva su estado.")
            return
        carpeta = settings.BASE_DIR / "demo"
        with (carpeta / "primera.png").open("rb") as imagen, (carpeta / "fragmento.wav").open("rb") as audio:
            obra = Transcripcion(titulo="Estudio de la mañana", slug=slug, demostracion=True,
                                 descripcion="Muestra de lectura y escucha para probar la ficha.",
                                 imagen=File(imagen, "primera.png"), audio=File(audio, "fragmento.wav"),
                                 correo="partituras@example.invalid", publicada=True)
            obra.full_clean()
            obra.save()
        self.stdout.write("Demostración publicada.")
