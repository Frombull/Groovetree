import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { imageUrl, caption } = body;

    // Verify photo ownership
    const photo = await prisma.photo.findUnique({
      where: { id },
      include: { page: true },
    });

    if (!photo || photo.page.userId !== user.id) {
      return NextResponse.json(
        { error: "Photo not found or unauthorized" },
        { status: 403 }
      );
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id },
      data: {
        imageUrl: imageUrl || photo.imageUrl,
        caption: caption !== undefined ? caption : photo.caption,
      },
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify photo ownership
    const photo = await prisma.photo.findUnique({
      where: { id },
      include: { page: true },
    });

    if (!photo || photo.page.userId !== user.id) {
      return NextResponse.json(
        { error: "Photo not found or unauthorized" },
        { status: 403 }
      );
    }

    await prisma.photo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
