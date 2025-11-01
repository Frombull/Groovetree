import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      slug,
      title,
      bio,
      avatarUrl,
      backgroundColor,
      textColor,
      backgroundImageUrl,
    } = await req.json();

    const page = await prisma.page.findFirst({
      where: { userId: user.id },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // verify slug
    let finalSlug = page.slug;
    if (slug !== undefined && slug !== page.slug) {
      // Clean slug string
      const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");

      // Check duplicate slug
      const existingPage = await prisma.page.findUnique({
        where: { slug: cleanSlug },
      });

      if (existingPage && existingPage.id !== page.id) {
        return NextResponse.json(
          { error: "Slug already in use" },
          { status: 400 }
        );
      }

      finalSlug = cleanSlug;
    }

    const updatedPage = await prisma.page.update({
      where: { id: page.id },
      data: {
        ...(slug !== undefined && { slug: finalSlug }),
        ...(title !== undefined && { title }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(backgroundColor !== undefined && { backgroundColor }),
        ...(textColor !== undefined && { textColor }),
        ...(backgroundImageUrl !== undefined && { backgroundImageUrl }),
      },
      include: {
        links: {
          orderBy: { order: "asc" },
        },
        events: {
          orderBy: { date: "asc" },
        },
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
