import { NextResponse } from "next/server";
import textToSpeech from "@google-cloud/text-to-speech";

const client = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
});

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No se proporcionó texto" }, { status: 400 });
    }

    const request = {
      input: { text },
      voice: { languageCode: "es-ES", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await client.synthesizeSpeech(request);

    return new NextResponse(response.audioContent, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="tts.mp3"',
      },
    });
  } catch (err) {
    console.error("❌ Error en TTS:", err);
    return NextResponse.json({ error: "Error generando voz" }, { status: 500 });
  }
}
