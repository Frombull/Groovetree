import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const artists = await prisma.page.findMany({
      // where: {
      //   avatarUrl: { not: null },
      // },
      select: {
        id: true,
        slug: true,
        title: true,
        bio: true,
        avatarUrl: true,
        backgroundColor: true,
        links: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            url: true,
            type: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        events: {
          where: {
            isActive: true,
            date: {
              gte: new Date(),
            },
          },
          select: {
            id: true,
            title: true,
            venue: true,
            city: true,
            state: true,
            date: true,
            ticketUrl: true,
          },
          orderBy: {
            date: "asc",
          },
          take: 2,
        },
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(artists);
  } catch (error) {
    console.error("Error fetching featured artists:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export const revalidate = 300; // Cache revalidate time
