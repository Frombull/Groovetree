import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  page?: {
    slug: string;
    avatarUrl?: string | null;
  } | null;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

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
        pages: {
          select: {
            slug: true,
            avatarUrl: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error verifying authentication:", error);
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Unauthenticated user");
  }

  return user;
}
