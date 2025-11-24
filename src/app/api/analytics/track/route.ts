import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pageId, type, platform } = body;

    if (!pageId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verificar se a página existe
    const page = await prisma.page.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Registrar evento baseado no tipo
    if (type === "pageView") {
      // @ts-ignore - Prisma Client types may not be updated yet
      await prisma.pageView.create({
        data: {
          pageId,
        },
      });
    } else if (type === "share") {
      // @ts-ignore - Prisma Client types may not be updated yet
      await prisma.shareEvent.create({
        data: {
          pageId,
          platform: platform || "unknown",
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error tracking analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
