// src/app/api/destinos/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request, context) {
  // ✅ Esperar params correctamente (Next 14+ requiere esto)
  const params = await context.params;
  const { id } = params; // id aquí es el "slug" (ej: "cusco")

  try {
    const destino = await prisma.destino.findUnique({
      where: { slug: id }, // ✅ Buscar por slug, no por id numérico
    });

    if (!destino) {
      return NextResponse.json({ error: 'Destino no encontrado' }, { status: 404 });
    }

    return NextResponse.json(destino);
  } catch (error) {
    console.error('❌ Error al obtener destino:', error);
    return NextResponse.json({ error: 'Error al obtener destino' }, { status: 500 });
  }
}
