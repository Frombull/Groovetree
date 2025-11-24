import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  page?: {
    slug: string;
    avatarUrl?: string | null;
  } | null;
}

export async function getAuthUser(req?: Request): Promise<AuthUser | null> {
  try {
    let token: string | null | undefined = null;

    // Se uma requisição foi passada, tenta pegar o token do header Authorization primeiro
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove "Bearer " do início
      }
    }

    // Se não encontrou no header ou não foi passada uma requisição, tenta pegar dos cookies
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("auth-token")?.value;
    }

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { userId: string; email: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        page: {
          select: {
            slug: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      page: user.page || null,
    };
  } catch (error) {
    console.error("Error verifying authentication:", error);
    return null;
  }
}

export async function requireAuth(req?: Request): Promise<AuthUser> {
  const user = await getAuthUser(req);

  if (!user) {
    throw new Error("Unauthenticated user");
  }

  return user;
}

export async function verifyAuth(req: Request): Promise<AuthUser | null> {
  try {
    let token: string | null = null;

    // Primeiro tenta pegar o token do header Authorization (Bearer token)
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove "Bearer " do início
    }

    // Se não encontrou no header, tenta pegar dos cookies
    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        token = cookies["auth-token"];
      }
    }

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { userId: string; email: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        page: {
          select: {
            slug: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      page: user.page || null,
    };
  } catch (error) {
    console.error("Error verifying auth:", error);
    return null;
  }
}

// Helper para extrair apenas o userId
export async function verifyAuthUserId(req: Request): Promise<string | null> {
  const user = await verifyAuth(req);
  return user ? user.id : null;
}
