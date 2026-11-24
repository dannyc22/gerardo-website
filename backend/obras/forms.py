from django import forms
from django.core.files.uploadedfile import UploadedFile
from .models import Transcripcion


class FormularioTranscripcion(forms.ModelForm):
    class Meta:
        model = Transcripcion
        fields = "__all__"

    def clean_audio(self):
        audio = self.cleaned_data.get("audio")
        if isinstance(audio, UploadedFile):
            inicio = audio.read(12)
            audio.seek(0)
            if audio.name.lower().endswith(".wav"):
                valido = inicio.startswith(b"RIFF") and inicio[8:12] == b"WAVE"
            else:
                valido = inicio.startswith(b"ID3") or (len(inicio) >= 2 and inicio[0] == 255 and inicio[1] & 224 == 224)
            if not valido:
                raise forms.ValidationError("Selecciona un archivo de audio WAV o MP3.")
        return audio
