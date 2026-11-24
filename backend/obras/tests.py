from tempfile import TemporaryDirectory
from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import TestCase
from .models import Transcripcion


class PublicacionTest(TestCase):
    def test_ciclo_desde_panel(self):
        self.client.force_login(get_user_model().objects.create_superuser(username="editora"))
        datos = {"titulo": "Pieza", "slug": "pieza", "correo": "obra@example.org"}
        self.client.post("/admin/obras/transcripcion/add/", datos)
        obra = Transcripcion.objects.get()
        editar = f"/admin/obras/transcripcion/{obra.pk}/change/"
        detalle = "/api/transcripciones/pieza/"
        lista = "/api/transcripciones/"
        rutas = [detalle, "/muestras/pieza/imagen/", "/muestras/pieza/audio/"]
        datos["publicada"] = "on"
        self.assertContains(self.client.post(editar, datos), "obligatorio para publicar")
        self.assertEqual(self.client.get(lista).json(), [])
        for ruta in rutas:
            self.assertEqual(self.client.get(ruta).status_code, 404)
        with TemporaryDirectory() as carpeta, self.settings(MEDIA_ROOT=carpeta):
            demo = settings.BASE_DIR / "demo"
            with (demo / "primera.png").open("rb") as imagen, (demo / "fragmento.wav").open("rb") as audio:
                self.assertEqual(self.client.post(editar, {**datos, "imagen": imagen, "audio": audio}).status_code, 302)
            self.assertEqual(self.client.get(lista).json(), [self.client.get(detalle).json()])
            for ruta in rutas:
                self.assertEqual(self.client.get(ruta).status_code, 200)
            del datos["publicada"]
            self.assertEqual(self.client.post(editar, datos).status_code, 302)
            for ruta in rutas:
                self.assertEqual(self.client.get(ruta).status_code, 404)


class PortafolioTest(TestCase):
    def test_importar_y_retirar_proyecto(self):
        from django.core.management import call_command
        from .models import Proyecto

        with TemporaryDirectory() as carpeta, self.settings(MEDIA_ROOT=carpeta):
            call_command("cargar_portafolio")
            obras = self.client.get("/api/proyectos/").json()
            self.assertEqual(len(obras), 7)
            self.assertEqual(sum(bool(p["escucha"]) for p in obras), 4)
            for p in obras:
                self.assertEqual(self.client.get(p["portada"]).status_code, 200)
            obra = obras[0]
            Proyecto.objects.filter(slug=obra["slug"]).update(publicado=False)
            call_command("cargar_portafolio")
            self.assertEqual(len(self.client.get("/api/proyectos/").json()), 6)
            self.assertEqual(self.client.get(obra["portada"]).status_code, 404)
            self.assertEqual(self.client.get("/api/proyectos/" + obra["slug"] + "/").status_code, 404)
