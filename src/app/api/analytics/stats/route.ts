import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Buscar a página do usuário
    const userPage = await prisma.page.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!userPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const pageId = userPage.id;

    // Obter parâmetro de período (7d, 30d, 90d, all)
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30d";

    // Calcular data de início baseado no período
    let startDate = new Date();
    if (period === "7d") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "30d") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === "90d") {
      startDate.setDate(startDate.getDate() - 90);
    } else if (period === "all") {
      startDate = new Date(0); // Desde o início dos tempos
    }

    // Buscar contadores totais
    const [totalPageViews, totalFavorites, totalShares] = await Promise.all([
      // @ts-ignore - Prisma Client types may not be updated yet
      prisma.pageView.count({
        where: {
          pageId,
          createdAt: { gte: startDate },
        },
      }),
      prisma.favoriteArtist.count({
        where: {
          pageId,
          createdAt: { gte: startDate },
        },
      }),
      // @ts-ignore - Prisma Client types may not be updated yet
      prisma.shareEvent.count({
        where: {
          pageId,
          createdAt: { gte: startDate },
        },
      }),
    ]);

    // Buscar dados para gráficos (agrupados por dia)
    const pageViewsData = await prisma.$queryRaw<
      Array<{ date: Date; count: bigint }>
    >`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "PageView"
      WHERE "pageId" = ${pageId} AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    const favoritesData = await prisma.$queryRaw<
      Array<{ date: Date; count: bigint }>
    >`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "FavoriteArtist"
      WHERE "pageId" = ${pageId} AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    const sharesData = await prisma.$queryRaw<
      Array<{ date: Date; count: bigint }>
    >`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "ShareEvent"
      WHERE "pageId" = ${pageId} AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Formatar dados para o frontend
    const formatChartData = (data: Array<{ date: Date; count: bigint }>) => {
      return data.map((item) => ({
        date: item.date.toISOString().split("T")[0],
        count: Number(item.count),
      }));
    };

    return NextResponse.json(
      {
        totals: {
          pageViews: totalPageViews,
          favorites: totalFavorites,
          shares: totalShares,
        },
        charts: {
          pageViews: formatChartData(pageViewsData),
          favorites: formatChartData(favoritesData),
          shares: formatChartData(sharesData),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
