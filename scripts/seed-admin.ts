import prisma from "../src/config/prisma";
import * as argon2 from "argon2";

async function seedAdmin() {
  console.log("Iniciando seed de Administrador...");

  // 1. Crear roles si no existen
  const adminRole = await prisma.roles.upsert({
    where: { rol_name: "ADMIN" },
    update: {},
    create: { rol_name: "ADMIN" },
  });

  const vocalRole = await prisma.roles.upsert({
    where: { rol_name: "VOCAL" },
    update: {},
    create: { rol_name: "VOCAL" },
  });

  console.log(
    "Roles verificados/creados:",
    adminRole.rol_name,
    vocalRole.rol_name,
  );

  // 2. Crear usuario administrador
  const adminEmail = "admin@gmail.com";
  const rawPassword = "admin123"; // Contraseña temporal por defecto

  // Encriptar la contraseña usando Argon2 tal como lo espera auth.service.ts
  const hashedPassword = await argon2.hash(rawPassword);

  const adminUser = await prisma.users.upsert({
    where: { user_email: adminEmail },
    update: {},
    create: {
      user_name: "Administrador Principal",
      user_email: adminEmail,
      user_password: hashedPassword,
      rol_id: adminRole.rol_id,
      is_active: true,
    },
  });

  console.log(`Usuario Admin verificado/creado:`);
  console.log(`- Email: ${adminUser.user_email}`);
  console.log(`- Contraseña temporal: ${rawPassword}`);
  console.log("¡Seed completado con éxito!");
}

seedAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
