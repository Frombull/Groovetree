import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";
import { convertToEmbed } from "@/lib/embedUtils";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, url, type, pageId } = await req.json();

    // Verifica se a página pertence ao usuário
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        userId: user.id,
      },
      include: {
        links: true,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Determina a ordem do novo link
    const maxOrder =
      page.links.length > 0 ? Math.max(...page.links.map((l) => l.order)) : -1;

    // Gera embedUrl automaticamente se possível
    const embedUrl = convertToEmbed(url, type);

    const link = await prisma.link.create({
      data: {
        title,
        url,
        embedUrl, // Adiciona embedUrl
        type,
        order: maxOrder + 1,
        pageId,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
