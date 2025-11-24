import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuthUserId } from "@/app/lib/auth";

// GET - Listar todos os artistas favoritos do usuário
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const favorites = await prisma.favoriteArtist.findMany({
      where: {
        userId,
      },
      include: {
        page: {
          select: {
            id: true,
            slug: true,
            title: true,
            avatarUrl: true,
            bio: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      favorites: favorites.map((fav) => ({
        id: fav.id,
        pageId: fav.page.id,
        slug: fav.page.slug,
        title: fav.page.title,
        avatarUrl: fav.page.avatarUrl,
        bio: fav.page.bio,
        name: fav.page.user.name,
        favoritedAt: fav.createdAt,
      })),
    });
  } catch (error) {
    console.error("[FAVORITES LIST] Error:", error);
    return NextResponse.json(
      { error: "Erro ao listar favoritos" },
      { status: 500 }
    );
  }
}
