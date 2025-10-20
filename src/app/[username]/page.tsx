import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

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
    user,
    title,
    bio,
    links,
    events,
    photos,
  } = page;

  const { name } = user;
  console.log(backgroundImageUrl);

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
    <main className="relative min-h-screen bg-black">
      {/* Background image with overlay */}
      {backgroundImageUrl && (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          />
          <div className="fixed inset-0 z-0 bg-black/90 backdrop-blur-md" />
        </>
      )}

      {/* Content */}
      <div className="relative z-[9999] mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <ArtistProfile
          name={name}
          title={title}
          bio={bio}
          avatarUrl={avatarUrl || undefined}
        />
        <SocialLinks links={socialLinks} />
        <MusicPlatforms links={musicLinks} />

        <ShowCalendar events={events} />
        <PhotoGallery photos={photos} />

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
