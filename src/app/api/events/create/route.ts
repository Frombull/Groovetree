import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // 1. Verifica se o usuário está autenticado
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Pega os dados do evento do body da requisição
    const { title, venue, city, state, date, ticketUrl } = await req.json();

    // 3. Validações básicas
    if (!title || !venue || !city || !date) {
      return NextResponse.json(
        { error: "Title, venue, city and date are required" },
        { status: 400 }
      );
    }

    // 4. Busca a página do usuário logado
    const userPage = await prisma.page.findFirst({
      where: { userId: user.id },
    });

    if (!userPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // 5. Cria o evento no banco de dados
    const event = await prisma.event.create({
      data: {
        title,
        venue,
        city,
        state: state || null, // Estado separado
        date: new Date(date), // Converte string para Date
        ticketUrl: ticketUrl || null,
        pageId: userPage.id,
      },
    });

    // 6. Retorna o evento criado
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
