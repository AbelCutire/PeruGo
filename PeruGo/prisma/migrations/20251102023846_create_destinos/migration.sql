-- CreateTable
CREATE TABLE `Destino` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `ubicacion` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `precio` DOUBLE NOT NULL,
    `duracion` VARCHAR(191) NOT NULL,
    `presupuesto` VARCHAR(191) NOT NULL,
    `imagen` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `gastos` JSON NOT NULL,
    `tours` JSON NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Destino_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
