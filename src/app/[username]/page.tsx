import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { isLightColor } from "@/lib/utils";

import { ArtistProfile } from "./_components/artist-profile";
import MusicPlatforms from "./_components/music-platforms";
import { PhotoGallery } from "./_components/photo-gallery";
import { ShowCalendar } from "./_components/show-calendar";
import Link from "next/link";
import { SocialLinks } from "./_components/social-links";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getUserPage(username: string) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        slug: username,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        links: {
          where: {
            isActive: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        events: {
          where: {
            isActive: true,
          },
          orderBy: {
            date: "asc",
          },
        },
        photos: {
          where: {
            isActive: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return page;
  } catch (error) {
    console.error("Error fetching user page:", error);
    return null;
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const page = await getUserPage(username);

  if (!page) redirect("/");

  console.log(page);

  const {
    avatarUrl,
    backgroundImageUrl,
    backgroundColor,
    textColor,
    user,
    title,
    bio,
    links,
    events,
    photos,
  } = page;

  const { name } = user;
  console.log(backgroundImageUrl);

  // Detecta se o fundo é claro ou escuro
  const isLight = isLightColor(backgroundColor);

  // Separar links por tipo
  const socialLinks = links.filter((link) =>
    ["INSTAGRAM", "TIKTOK", "YOUTUBE", "FACEBOOK", "TWITTER"].includes(
      link.type
    )
  );

  const musicLinks = links.filter((link) =>
    [
      "SPOTIFY",
      "APPLE_MUSIC",
      "DEEZER",
      "SOUNDCLOUD",
      "YOUTUBE_MUSIC",
      "BEATPORT",
    ].includes(link.type)
  );

  return (
    <main
      className="relative min-h-screen"
      style={{
        backgroundColor: backgroundColor || "#000000",
      }}
    >
      {/* Background image with overlay */}
      {backgroundImageUrl && (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          />
          <div
            className="fixed inset-0 z-0 backdrop-blur-md"
            style={{
              backgroundColor: isLight
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(0, 0, 0, 0.7)",
            }}
          />
        </>
      )}

      {/* Content */}
      <div
        className="relative z-[9999] mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8"
        style={{ color: textColor || (isLight ? "#000000" : "#ffffff") }}
      >
        <ArtistProfile
          name={name}
          title={title}
          bio={bio}
          avatarUrl={avatarUrl || undefined}
          textColor={textColor || (isLight ? "#000000" : "#ffffff")}
        />
        <SocialLinks links={socialLinks} isLight={isLight} />
        <MusicPlatforms links={musicLinks} isLight={isLight} />

        <ShowCalendar events={events} isLight={isLight} />
        <PhotoGallery photos={photos} isLight={isLight} />

        <p className="mt-8 text-center text-sm text-muted-foreground">
          © 2025{" "}
          <Link href="/" className="underline">
            Groovetree
          </Link>
          {". "}
          Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
}
