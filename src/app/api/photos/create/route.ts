import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, caption, pageId } = body;

    if (!imageUrl || !pageId) {
      return NextResponse.json(
        { error: "Image URL and page ID are required" },
        { status: 400 }
      );
    }

    // Verify page ownership
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { userId: true },
    });

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: "Page not found or unauthorized" },
        { status: 403 }
      );
    }

    // Get the current max order
    const maxOrder = await prisma.photo.findFirst({
      where: { pageId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const photo = await prisma.photo.create({
      data: {
        imageUrl,
        caption: caption || null,
        order: (maxOrder?.order ?? -1) + 1,
        pageId,
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error("Error creating photo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
