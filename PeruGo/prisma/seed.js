import { PrismaClient } from '@prisma/client';
import { destinos } from '../src/data/destinos.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌎 Insertando destinos desde src/data/destinos.js...');

  if (!destinos || destinos.length === 0) {
    console.log('❌ No hay destinos definidos en el archivo local.');
    return;
  }

  // Eliminar datos anteriores
  await prisma.destino.deleteMany();
  console.log('🧹 Datos anteriores eliminados.');

  // Insertar nuevos datos
  for (const d of destinos) {
    // Generar slug válido automáticamente
    const slug =
      d.slug ||
      d.id ||
      (d.nombre
        ? d.nombre
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
        : 'sin-slug');

    // Omitir 'id' ya que Prisma lo genera automáticamente
    const { id, ...dataSinId } = d;

    await prisma.destino.create({
      data: {
        ...dataSinId,
        slug,
      },
    });
  }

  console.log(`✅ ${destinos.length} destinos insertados correctamente.`);
}

main()
  .catch((e) => {
    console.error('❌ Error al insertar destinos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
