import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, contextPromise) {
  // ✅ contextPromise ahora es una promesa, así que debemos esperarla
  const { params } = await contextPromise;
  const slugOrId = decodeURIComponent(params.id); // decodifica espacios y caracteres especiales

  try {
    // Primero intenta buscar por slug
    let destino = await prisma.destino.findUnique({
      where: { slug: slugOrId },
    });

    // Si no encuentra, intenta por ID numérico
    if (!destino) {
      const numericId = parseInt(slugOrId, 10);
      if (!isNaN(numericId)) {
        destino = await prisma.destino.findUnique({
          where: { id: numericId },
        });
      }
    }

    // Si sigue sin encontrar
    if (!destino) {
      return NextResponse.json(
        { error: "Destino no encontrado" },
        { status: 404 }
      );
    }

    // Todo bien ✅
    return NextResponse.json(destino);
  } catch (error) {
    console.error("Error en /api/destinos/[id]:", error);
    return NextResponse.json(
      { error: "Error al obtener el destino" },
      { status: 500 }
    );
  }
}
