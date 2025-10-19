import "./globals.css";
import "../index.css";

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
      <body>{children}</body>
    </html>
  );
}
