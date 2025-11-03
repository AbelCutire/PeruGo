import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Intentar buscar primero por slug
    let destino = await prisma.destino.findUnique({
      where: { slug: id },
    });

    // Si no existe, intentar buscar por ID numérico
    if (!destino && !isNaN(Number(id))) {
      destino = await prisma.destino.findUnique({
        where: { id: Number(id) },
      });
    }

    if (!destino) {
      return NextResponse.json(
        { error: "Destino no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(destino);
  } catch (error) {
    console.error("Error en API destinos/[id]:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
