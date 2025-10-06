from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permite comunicación con React

@app.route('/')
def home():
    return jsonify({"message": "Backend operativo."})

@app.route('/process', methods=['POST'])
def process_input():
    data = request.get_json()
    user_text = data.get("text")

    # Ejemplo: simulamos procesamiento por LLM
    llm_response = f"Simulando respuesta para: '{user_text}'"

    # Aquí luego integrará la API real (OpenAI, Anthropic, Mistral, etc.)
    # y el servicio de MiniMax TTS

    return jsonify({
        "text_response": llm_response,
        "audio_url": None  # Aquí colocará la URL o base64 del audio generado
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
