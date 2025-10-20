from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests
import json
import base64

# --------------------------
# Configuración base
# --------------------------
load_dotenv()
app = Flask(__name__)
CORS(app)

MINIMAX_API_KEY = os.getenv("MINIMAX_API_KEY")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

MINIMAX_BASE = "https://api.minimax.io/v1/text/chatcompletion_v2"
MISTRAL_BASE = "https://api.mistral.ai/v1"

# --------------------------
# Home simple
# --------------------------
@app.route('/')
def home():
    return jsonify({"message": "Servidor backend operativo."})

# --------------------------
# 1️⃣ Ruta STS: recibe audio → LLM → audio respuesta
# --------------------------
@app.route('/sts', methods=['POST'])
def speech_to_speech():
    """
    Flujo completo STS:
    - Recibe archivo de audio (.wav o .mp3)
    - Llama a MiniMax STT para convertirlo en texto
    - Procesa el texto con Mistral (LLM francés)
    - Llama a MiniMax TTS para convertir respuesta a audio
    - Devuelve texto + audio (base64 o URL)
    """
    if 'audio' not in request.files:
        return jsonify({"error": "No se envió archivo de audio"}), 400

    audio_file = request.files['audio']

    # --------------------------------
    # 1) STT: Enviar a MiniMax para transcripción
    # --------------------------------
    stt_text = call_minimax_stt(audio_file)
    if not stt_text:
        return jsonify({"error": "Fallo en transcripción"}), 500

    # --------------------------------
    # 2) Procesamiento con Mistral (LLM)
    # --------------------------------
    llm_output = call_mistral_llm(stt_text)
    llm_text = llm_output.get("reply", "No se pudo generar respuesta.")
    action = llm_output.get("action", "none")

    # --------------------------------
    # 3) Generar audio con MiniMax TTS
    # --------------------------------
    tts_audio = call_minimax_tts(llm_text)

    # Codificar audio en base64 para respuesta directa
    audio_base64 = base64.b64encode(tts_audio).decode('utf-8') if tts_audio else None

    # --------------------------------
    # 4) Respuesta al frontend
    # --------------------------------
    return jsonify({
        "stt_text": stt_text,
        "llm_response": llm_text,
        "action": action,  # por ejemplo "show_profile", "search", etc.
        "audio_base64": audio_base64
    })


# --------------------------
# Función: MiniMax STT
# --------------------------
def call_minimax_stt(audio_file):
    """
    Envía un archivo de audio a MiniMax Speech-02 (STT)
    """
    url = f"{MINIMAX_BASE}/speech:transcribe"
    headers = {"Authorization": f"Bearer {MINIMAX_API_KEY}"}
    files = {"file": (audio_file.filename, audio_file, audio_file.mimetype)}

    try:
        r = requests.post(url, headers=headers, files=files)
        r.raise_for_status()
        result = r.json()
        return result.get("text", "")
    except Exception as e:
        print("Error en STT:", e)
        return None


# --------------------------
# Función: LLM (Mistral)
# --------------------------
def call_mistral_llm(user_text):
    """
    Envía texto a Mistral (modelo francés) y pide análisis semántico.
    """
    url = f"{MISTRAL_BASE}/chat/completions"
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }

    # Prompt diseñado para NLU estructurado (intención, respuesta, acción)
    prompt = f"""
Tu rol: asistente turístico francés para la plataforma PerúGo.
El usuario dijo: "{user_text}"

Devuelve SOLO JSON con:
{{
  "reply": "Respuesta breve al usuario en español",
  "intent": "intención detectada (buscar, mostrar perfil, reservar, etc.)",
  "action": "acción backend (show_profile, search, open_map, none)",
  "entities": {{"lugar": "...", "fecha": "..."}}
}}
    """

    body = {
        "model": "mistral-large-latest",  # o "mistral-small" según costo
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.5,
        "max_tokens": 200
    }

    try:
        r = requests.post(url, headers=headers, json=body)
        r.raise_for_status()
        raw = r.json()
        content = raw["choices"][0]["message"]["content"]

        # Intentar decodificar JSON generado
        try:
            parsed = json.loads(content)
            return parsed
        except:
            return {"reply": content, "action": "none"}

    except Exception as e:
        print("Error en Mistral:", e)
        return {"reply": "Error procesando con Mistral", "action": "none"}


# --------------------------
# Función: MiniMax TTS
# --------------------------
def call_minimax_tts(text):
    """
    Convierte texto a audio usando MiniMax Speech
    """
    url = f"{MINIMAX_BASE}/speech:generate"
    headers = {"Authorization": f"Bearer {MINIMAX_API_KEY}"}
    payload = {
        "text": text,
        "voice": "alloy",  # o "default" según las voces disponibles
        "format": "mp3"
    }

    try:
        r = requests.post(url, headers=headers, json=payload)
        r.raise_for_status()
        # La API devuelve bytes o un campo base64, depende de la versión
        return r.content
    except Exception as e:
        print("Error en TTS:", e)
        return None


# --------------------------
# Ejecutar servidor
# --------------------------
if __name__ == '__main__':
    app.run(port=5000, debug=True)

