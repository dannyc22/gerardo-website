from django.contrib import admin
from django.urls import path, re_path
from obras import views

urlpatterns = [
    path("api/proyectos/", views.proyectos),
    path("api/proyectos/<slug:slug>/", views.proyectos),
    path("muestras/proyectos/<slug:slug>/portada/", views.portada, name="portada"),
    path("admin/", admin.site.urls),
    path("api/transcripciones/", views.fichas),
    path("api/transcripciones/<slug:slug>/", views.fichas),
    re_path(r"^muestras/(?P<slug>[-\w]+)/(?P<campo>imagen|audio)/$", views.muestra, name="muestra"),
]
