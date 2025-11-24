import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { isLightColor } from "@/lib/utils";

import { ArtistProfile } from "./_components/artist-profile";
import MusicPlatforms from "./_components/music-platforms";
import { PhotoGallery } from "./_components/photo-gallery";
import { ShowCalendar } from "./_components/show-calendar";
import Link from "next/link";
import { SocialLinks } from "./_components/social-links";
import { FavoriteButton } from "./_components/favorite-button";
import { ShareButton } from "./_components/share-button";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getUserPage(username: string) {
  try {
    console.log(
      `[USER PAGE] Attempting to fetch page for username: ${username}`
    );

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

    console.log(`[USER PAGE] Page found:`, page ? "Yes" : "No");
    return page;
  } catch (error) {
    console.error("[USER PAGE] Error fetching user page:", error);
    return null;
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;

  console.log(`[USER PAGE] Rendering page for username: ${username}`);

  const page = await getUserPage(username);

  if (!page) {
    console.error(
      `[USER PAGE] Page not found for username: ${username}, redirecting to home`
    );
    redirect("/");
  }

  console.log(`[USER PAGE] Successfully loaded page for: ${username}`);

  const {
    id: pageId,
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

      {/* Back button */}
      <Link
        href="/"
        className="fixed left-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110"
        style={{
          backgroundColor: isLight
            ? "rgba(0, 0, 0, 0.1)"
            : "rgba(255, 255, 255, 0.1)",
          color: textColor || (isLight ? "#000000" : "#ffffff"),
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </Link>

      {/* Favorite button */}
      <FavoriteButton pageId={pageId} isLight={isLight} />

      {/* Share button */}
      <ShareButton
        pageId={pageId}
        artistName={name || ""}
        artistTitle={title}
        artistSlug={username}
        avatarUrl={avatarUrl}
        isLight={isLight}
        textColor={textColor}
      />

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
        </p>
      </div>
    </main>
  );
}
