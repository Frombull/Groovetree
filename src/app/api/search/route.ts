import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ artists: [] });
    }

    // Buscar páginas que correspondem à query
    const artists = await prisma.page.findMany({
      where: {
        OR: [
          {
            slug: {
              contains: query.toLowerCase(),
              mode: "insensitive",
            },
          },
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            user: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      select: {
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
      take: 5, // Limitar a 5 resultados
    });

    return NextResponse.json({ artists });
  } catch (error) {
    console.error("Error searching artists:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
