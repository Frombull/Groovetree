import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      console.error("[CREATE PAGE] Unauthorized - no user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, title, bio } = await req.json();
    console.log(`[CREATE PAGE] Attempting to create page for user ${user.id} with slug: ${slug}`);

    // Verifica se já existe uma página para este usuário
    const existingPage = await prisma.page.findFirst({
      where: { userId: user.id },
    });

    if (existingPage) {
      console.error(`[CREATE PAGE] User ${user.id} already has a page with slug: ${existingPage.slug}`);
      return NextResponse.json(
        { error: "User already has a page", existingSlug: existingPage.slug },
        { status: 400 }
      );
    }

    // Função para gerar um slug único baseado no username
    const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
      // Limpa o slug: remove espaços, caracteres especiais, converte para lowercase
      const cleanSlug = baseSlug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Substitui espaços por hífens
        .replace(/[^\w\-]/g, '')     // Remove caracteres especiais
        .replace(/\-\-+/g, '-')      // Remove hífens duplicados
        .replace(/^-+/, '')          // Remove hífens do início
        .replace(/-+$/, '');         // Remove hífens do final

      let uniqueSlug = cleanSlug;
      let counter = 1;

      // Verifica se o slug já existe e incrementa até encontrar um disponível
      while (await prisma.page.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${cleanSlug}${counter}`;
        counter++;
      }

      return uniqueSlug;
    };

    // Gera um slug base a partir do username ou slug fornecido
    const baseSlug = slug || user.name || user.email.split('@')[0];

    // Tentar criar a página com retry em caso de conflito
    type PageWithRelations = Awaited<ReturnType<typeof prisma.page.create>>;
    let page: PageWithRelations | null = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (!page && attempts < maxAttempts) {
      try {
        const finalSlug = await generateUniqueSlug(baseSlug);

        if (finalSlug !== slug && attempts === 0) {
          console.log(`[CREATE PAGE] Slug '${slug}' was in use or invalid, generated unique slug: ${finalSlug}`);
        }

        page = await prisma.page.create({
          data: {
            slug: finalSlug,
            title: title || user.name || "My Page",
            bio: bio || "",
            userId: user.id,
          },
          include: {
            links: true,
            events: true,
          },
        });

        console.log(`[CREATE PAGE] Page created successfully with slug: ${finalSlug}`);
      } catch (error: unknown) {
        // Se for erro de slug duplicado (P2002), tenta novamente
        const prismaError = error as { code?: string; meta?: { target?: string[] } };
        if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('slug')) {
          attempts++;
          console.log(`[CREATE PAGE] Slug conflict detected, retrying... (attempt ${attempts}/${maxAttempts})`);

          if (attempts >= maxAttempts) {
            throw new Error(`Failed to create page after ${maxAttempts} attempts due to slug conflicts`);
          }

          // Aguarda um pouco antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 100 * attempts));
        } else {
          // Se for outro tipo de erro, lança novamente
          throw error;
        }
      }
    }

    if (!page) {
      throw new Error("Failed to create page");
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("[CREATE PAGE] Error creating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
