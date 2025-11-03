import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const destinos = await prisma.destino.findMany({
      orderBy: { creadoEn: 'desc' },
    });
    return NextResponse.json(destinos);
  } catch (error) {
    console.error('❌ Error al obtener destinos:', error);
    return NextResponse.json({ error: 'Error al obtener destinos' }, { status: 500 });
  }
}
