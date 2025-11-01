import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Busca página sem autenticação, páginas públicas
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        links: {
          where: {
            isActive: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        events: {
          where: {
            isActive: true,
          },
          orderBy: {
            date: "asc",
          },
        },
        photos: {
          where: {
            isActive: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("[GET PAGE BY SLUG] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
