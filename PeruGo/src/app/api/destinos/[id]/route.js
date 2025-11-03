import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, context) {
  const { params } = await context; // 👈 ahora esperamos los params correctamente
  const { id } = params;

  try {
    // Intentar buscar primero por slug
    let destino = await prisma.destino.findUnique({
      where: { slug: id },
    });

    // Si no existe, buscar por id numérico
    if (!destino) {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        destino = await prisma.destino.findUnique({
          where: { id: numericId },
        });
      }
    }

    if (!destino) {
      return NextResponse.json(
        { error: "Destino no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(destino);
  } catch (error) {
    console.error("Error en /api/destinos/[id]:", error);
    return NextResponse.json(
      { error: "Error al obtener el destino" },
      { status: 500 }
    );
  }
}
