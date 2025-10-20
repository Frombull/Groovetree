import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

// PUT - Atualizar evento
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verifica autenticação
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Pega os dados atualizados
    const { title, venue, city, state, date, ticketUrl } = await req.json();

    // 3. Busca a página do usuário
    const userPage = await prisma.page.findFirst({
      where: { userId: user.id },
    });

    if (!userPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // 4. Verifica se o evento pertence ao usuário
    const event = await prisma.event.findFirst({
      where: {
        id: params.id,
        pageId: userPage.id,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 5. Atualiza o evento
    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        venue,
        city,
        state: state || null,
        date: new Date(date),
        ticketUrl: ticketUrl || null,
      },
    });

    // 6. Retorna o evento atualizado
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar evento
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verifica autenticação
    const user = await verifyAuth(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Busca a página do usuário
    const userPage = await prisma.page.findFirst({
      where: { userId: user.id },
    });

    if (!userPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // 3. Verifica se o evento pertence ao usuário
    const event = await prisma.event.findFirst({
      where: {
        id: params.id,
        pageId: userPage.id,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 4. Deleta o evento
    await prisma.event.delete({
      where: { id: params.id },
    });

    // 5. Retorna sucesso
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
