import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuthUserId } from "@/app/lib/auth";

// POST - Adicionar artista aos favoritos
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { pageId } = body;

    if (!pageId) {
      return NextResponse.json(
        { error: "pageId é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se a página existe
    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      return NextResponse.json(
        { error: "Artista não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se não está favoritando sua própria página
    if (page.userId === userId) {
      return NextResponse.json(
        { error: "Você não pode favoritar sua própria página" },
        { status: 400 }
      );
    }

    // Criar favorito (ou ignorar se já existe)
    const favorite = await prisma.favoriteArtist.upsert({
      where: {
        userId_pageId: {
          userId,
          pageId,
        },
      },
      update: {},
      create: {
        userId,
        pageId,
      },
      include: {
        page: {
          select: {
            id: true,
            slug: true,
            title: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      favorite,
      message: "Artista adicionado aos favoritos",
    });
  } catch (error) {
    console.error("[FAVORITES POST] Error:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar favorito" },
      { status: 500 }
    );
  }
}

// DELETE - Remover artista dos favoritos
export async function DELETE(request: NextRequest) {
  try {
    const userId = await verifyAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId");

    if (!pageId) {
      return NextResponse.json(
        { error: "pageId é obrigatório" },
        { status: 400 }
      );
    }

    await prisma.favoriteArtist.delete({
      where: {
        userId_pageId: {
          userId,
          pageId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Artista removido dos favoritos",
    });
  } catch (error: any) {
    console.error("[FAVORITES DELETE] Error:", error);

    // Se não encontrou o favorito
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Favorito não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao remover favorito" },
      { status: 500 }
    );
  }
}

// GET - Verificar se um artista está favoritado
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId");

    if (!pageId) {
      return NextResponse.json(
        { error: "pageId é obrigatório" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favoriteArtist.findUnique({
      where: {
        userId_pageId: {
          userId,
          pageId,
        },
      },
    });

    return NextResponse.json({
      isFavorited: !!favorite,
    });
  } catch (error) {
    console.error("[FAVORITES GET] Error:", error);
    return NextResponse.json(
      { error: "Erro ao verificar favorito" },
      { status: 500 }
    );
  }
}
