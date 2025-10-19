import "./globals.css";
import "../index.css";

export const metadata = {
  title: "PeruGo",
  description: "Explora los mejores destinos turísticos del Perú",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
