import "./globals.css";
import "../index.css"; // Mantenemos tus estilos globales

// 1. Importamos los componentes que queremos fijos
import Header from "@/components/Header";
import Chat from "@/components/Chat";

export const metadata = {
  title: "PerúGo - Tu asistente de viajes en Perú",
  description: "Explora Perú con experiencias únicas, recomendaciones y voz asistida por IA.",
  keywords: ["PerúGo", "viajes en Perú", "turismo", "asistente de voz", "IA"],
  authors: [{ name: "PerúGo Team" }],
  openGraph: {
    title: "PerúGo - Tu asistente de viajes en Perú",
    description: "Explora Perú con experiencias únicas, recomendaciones y voz asistida por IA.",
    url: "https://perugo.vercel.app",
    siteName: "PerúGo",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PerúGo - Tu asistente de viajes en Perú",
    description: "Explora Perú con experiencias únicas, recomendaciones y voz asistida por IA.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>

      <body>
        {/* 2. El Header aparece primero */}
        <Header />

        {/* 3. Envolvemos el contenido de las páginas (children) en un main */}
        {/* Usamos paddingTop: '80px' para que el Header no tape el contenido */}
        <main style={{ paddingTop: "80px", minHeight: "100vh" }}>
          {children}
        </main>

        {/* 4. El Chat flotante aparece al final */}
        <Chat />
      </body>
    </html>
  );
}
