from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import requests

# Cargar variables del archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permite llamadas desde React

@app.route('/')
def home():
    return jsonify({"message": "Servidor backend operativo."})

@app.route('/process', methods=['POST'])
def process_input():
    """
    Recibe texto del frontend, lo procesa con el LLM,
    luego lo convierte en audio (TTS) con MiniMax y devuelve ambos resultados.
    """
    data = request.get_json()
    user_text = data.get("text")

    if not user_text:
        return jsonify({"error": "No se recibió texto"}), 400

    # Simular respuesta de un LLM por ahora:
    llm_response = f"Simulación: respuesta generada para '{user_text}'"

    # (Próximamente) Aquí se llamará a la API real de MiniMax para TTS
    audio_url = None

    return jsonify({
        "text_response": llm_response,
        "audio_url": audio_url
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
