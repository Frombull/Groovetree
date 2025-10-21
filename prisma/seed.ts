// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Limpar dados existentes
  await prisma.link.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();

  // Default passw0rd for test users
  const defaultPassword = await bcrypt.hash("admin", 12);

  // Test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "joaotestedasilva@gmail.com",
        name: "João Teste da Silva",
        password: defaultPassword,
        page: {
          create: {
            slug: "joao-teste-da-silva",
            title: "João Teste da Silva - Músico",
            bio: "Guitarrista e compositor apaixonado por rock e blues. Mais de 10 anos de experiência em shows ao vivo.",
            avatarUrl: "",
            links: {
              create: [
                {
                  title: "Spotify",
                  url: "https://open.spotify.com/artist/joaotestedasilva",
                  isActive: true,
                },
                {
                  title: "Instagram",
                  url: "https://instagram.com/joaotesteda_silva_musico",
                  isActive: true,
                },
                {
                  title: "YouTube",
                  url: "https://youtube.com/joaotestedasilvamusica",
                  isActive: true,
                },
                {
                  title: "Site Oficial",
                  url: "https://joaotestedasilva.com.br",
                  isActive: false,
                },
              ],
            },
          },
        },
      },
      include: {
        page: {
          include: {
            links: true,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "admin@gmail.com",
        name: "Admin",
        password: defaultPassword,
        page: {
          create: {
            slug: "admin",
            title: "Admin - Fiscal de POO",
            bio: "Bio do admin.",
            avatarUrl: "",
            links: {
              create: [
                {
                  title: "Spotify",
                  url: "https://open.spotify.com/artist/admin",
                  isActive: true,
                },
              ],
            },
          },
        },
      },
      include: {
        page: {
          include: {
            links: true,
          },
        },
      },
    }),
  ]);

  console.log(`Created users: ${users.length}`);

  // Users without a page
  const usersWithoutPage = await Promise.all([
    prisma.user.create({
      data: {
        email: "joaosempaginadasilva@exemplo.com",
        name: "João Sem Página da Silva",
        password: defaultPassword,
      },
    }),
  ]);

  console.log(`Users with no page: ${usersWithoutPage.length}`);
  console.log("Done seeding DB.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
