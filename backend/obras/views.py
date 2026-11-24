import logging
from django.http import FileResponse, Http404, JsonResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_safe
from .models import Proyecto, Transcripcion


def datos(obra):
    return {"titulo": obra.titulo, "slug": obra.slug, "descripcion": obra.descripcion,
            "correo": obra.correo, "demostracion": obra.demostracion,
            **{campo: reverse("muestra", args=[obra.slug, campo]) for campo in ("imagen", "audio")}}


@never_cache
@require_safe
def fichas(request, slug=None):
    publicadas = Transcripcion.objects.filter(publicada=True)
    if slug is None:
        return JsonResponse([datos(obra) for obra in publicadas], safe=False)
    obra = publicadas.filter(slug=slug).first()
    if obra is None:
        return JsonResponse({"detalle": "Transcripción no disponible."}, status=404)
    return JsonResponse(datos(obra))


@never_cache
@require_safe
def muestra(request, slug, campo):
    obra = get_object_or_404(Transcripcion, slug=slug, publicada=True)
    archivo = getattr(obra, campo)
    try:
        return FileResponse(archivo.open("rb"), filename=archivo.name)
    except FileNotFoundError:
        logging.getLogger(__name__).warning("Falta el archivo de %s para %s", campo, slug)
        raise Http404("Archivo no disponible.")


def datos_proyecto(proyecto):
    return {
        "titulo": proyecto.titulo, "slug": proyecto.slug, "categoria": proyecto.categoria,
        "formato": proyecto.formato, "periodo": proyecto.periodo, "descripcion": proyecto.descripcion,
        "escucha": proyecto.escucha,
        "portada": reverse("portada", args=[proyecto.slug]) if proyecto.portada else None,
    }


@never_cache
@require_safe
def proyectos(request, slug=None):
    publicados = Proyecto.objects.filter(publicado=True)
    if slug is None:
        return JsonResponse([datos_proyecto(proyecto) for proyecto in publicados], safe=False)
    proyecto = publicados.filter(slug=slug).first()
    if proyecto is None:
        return JsonResponse({"detalle": "Proyecto no disponible."}, status=404)
    return JsonResponse(datos_proyecto(proyecto))


@never_cache
@require_safe
def portada(request, slug):
    proyecto = get_object_or_404(Proyecto, publicado=True, slug=slug)
    if not proyecto.portada:
        raise Http404("Proyecto sin portada.")
    try:
        return FileResponse(proyecto.portada.open("rb"), filename=proyecto.portada.name)
    except FileNotFoundError:
        logging.getLogger(__name__).warning("Falta la portada de %s", slug)
        raise Http404("Portada no disponible.")
