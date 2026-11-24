from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models


class Transcripcion(models.Model):
    titulo = models.CharField("título", max_length=180)
    slug = models.SlugField("identificador para la dirección", unique=True)
    descripcion = models.TextField("descripción", blank=True)
    imagen = models.ImageField("imagen de la primera página", upload_to="paginas", blank=True,
                               validators=[FileExtensionValidator(["png", "jpg", "jpeg"])])
    audio = models.FileField("fragmento independiente (WAV o MP3)", upload_to="fragmentos", blank=True,
                             validators=[FileExtensionValidator(["wav", "mp3"])])
    correo = models.EmailField("correo para solicitudes", blank=True)
    demostracion = models.BooleanField("material de demostración", default=False)
    publicada = models.BooleanField("publicada", default=False)

    class Meta:
        verbose_name = "transcripción"
        verbose_name_plural = "transcripciones"
        ordering = ["titulo", "pk"]

    def __str__(self):
        return self.titulo

    def clean(self):
        if self.publicada:
            campos = ["imagen", "audio", "correo"]
            errores = {campo: "Este campo es obligatorio para publicar." for campo in campos if not getattr(self, campo)}
            if errores:
                raise ValidationError(errores)


class Proyecto(models.Model):
    class Categoria(models.TextChoices):
        ARREGLO = "Arreglo"
        COMPOSICION = "Composición"
        AGRUPACION = "Agrupación"

    titulo = models.CharField("título", max_length=180)
    slug = models.SlugField("identificador", unique=True)
    categoria = models.CharField("categoría", choices=Categoria.choices, max_length=20)
    formato = models.CharField(max_length=180)
    periodo = models.CharField("fecha o período", max_length=60, blank=True)
    descripcion = models.TextField("descripción")
    portada = models.ImageField("carátula o fotografía", upload_to="portafolio", blank=True,
                                validators=[FileExtensionValidator(["png", "jpg", "jpeg"])])
    escucha = models.URLField("enlace de escucha", blank=True)
    orden = models.PositiveSmallIntegerField(default=0)
    publicado = models.BooleanField(default=False)

    class Meta:
        ordering = ["orden", "titulo"]

    def __str__(self):
        return self.titulo
