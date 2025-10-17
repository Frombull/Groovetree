import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuth } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, title, bio } = await req.json();

    // Verifica se já existe uma página para este usuário
    const existingPage = await prisma.page.findFirst({
      where: { userId: user.id },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "User already has a page" },
        { status: 400 }
      );
    }

    // Verifica se o slug já está em uso
    const slugExists = await prisma.page.findUnique({
      where: { slug },
    });

    if (slugExists) {
      return NextResponse.json(
        { error: "Slug already in use" },
        { status: 400 }
      );
    }

    const page = await prisma.page.create({
      data: {
        slug,
        title,
        bio,
        userId: user.id,
      },
      include: {
        links: true,
        events: true,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
