import "@/index.css";

export const metadata = {
  title: "PeruGo",
  description: "Explora Perú con experiencias únicas y personalizadas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
