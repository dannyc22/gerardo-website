from django.contrib import admin
from django.forms.widgets import ClearableFileInput
from django.db import models
from .models import Proyecto, Transcripcion
from .forms import FormularioTranscripcion


class ArchivoLocal(ClearableFileInput):
    # El almacenamiento local carece de una URL pública directa.
    template_name = "obras/archivo.html"


@admin.register(Transcripcion)
class TranscripcionAdmin(admin.ModelAdmin):
    form = FormularioTranscripcion
    list_display = ["titulo", "publicada", "demostracion"]
    list_filter = ["publicada", "demostracion"]
    prepopulated_fields = {"slug": ("titulo",)}
    formfield_overrides = {models.FileField: {"widget": ArchivoLocal}}

admin.site.site_header = "Gerardo Castañeda · Administración"
admin.site.site_title = "Panel de música"


@admin.register(Proyecto)
class ProyectoAdmin(admin.ModelAdmin):
    list_display = ["titulo", "categoria", "publicado", "orden"]
    list_filter = ["categoria", "publicado"]
    prepopulated_fields = {"slug": ("titulo",)}
    formfield_overrides = {models.FileField: {"widget": ArchivoLocal}}
