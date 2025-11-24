import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuthUserId } from "@/app/lib/auth";

// GET - Obter calendário de shows dos artistas favoritos
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar todos os shows dos artistas favoritos
    const favoriteArtists = await prisma.favoriteArtist.findMany({
      where: {
        userId,
      },
      select: {
        pageId: true,
      },
    });

    const pageIds = favoriteArtists.map((fav) => fav.pageId);

    // Buscar eventos dos artistas favoritos (apenas futuros)
    const events = await prisma.event.findMany({
      where: {
        pageId: {
          in: pageIds,
        },
        isActive: true,
        date: {
          gte: new Date(), // Apenas eventos futuros ou de hoje
        },
      },
      include: {
        page: {
          select: {
            id: true,
            slug: true,
            title: true,
            avatarUrl: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json({
      events: events.map((event) => ({
        id: event.id,
        title: event.title,
        venue: event.venue,
        city: event.city,
        state: event.state,
        date: event.date,
        ticketUrl: event.ticketUrl,
        artist: {
          id: event.page.id,
          slug: event.page.slug,
          title: event.page.title,
          avatarUrl: event.page.avatarUrl,
          name: event.page.user.name,
        },
      })),
    });
  } catch (error) {
    console.error("[FAVORITES CALENDAR] Error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar calendário" },
      { status: 500 }
    );
  }
}
