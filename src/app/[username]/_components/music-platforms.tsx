"use client";

import {
  FaSpotify,
  FaApple,
  FaSoundcloud,
  FaYoutube,
  FaDeezer,
} from "react-icons/fa";
import { IoMdMusicalNote } from "react-icons/io";

interface Link {
  id: string;
  title: string;
  url: string;
  embedUrl?: string | null;
  type: string;
}

interface MusicPlatformsProps {
  links: Link[];
  isLight?: boolean;
}

// Mapeamento de ícones e cores por tipo
const platformConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  SPOTIFY: {
    icon: FaSpotify,
    color: "text-[#1DB954]",
    bgColor: "bg-[#1DB954]/10 hover:bg-[#1DB954]/20",
  },
  APPLE_MUSIC: {
    icon: FaApple,
    color: "text-[#FA243C]",
    bgColor: "bg-[#FA243C]/10 hover:bg-[#FA243C]/20",
  },
  SOUNDCLOUD: {
    icon: FaSoundcloud,
    color: "text-[#FF5500]",
    bgColor: "bg-[#FF5500]/10 hover:bg-[#FF5500]/20",
  },
  YOUTUBE: {
    icon: FaYoutube,
    color: "text-[#FF0000]",
    bgColor: "bg-[#FF0000]/10 hover:bg-[#FF0000]/20",
  },
  DEEZER: {
    icon: FaDeezer,
    color: "text-[#00C7F2]",
    bgColor: "bg-[#00C7F2]/10 hover:bg-[#00C7F2]/20",
  },
  BEATPORT: {
    icon: IoMdMusicalNote,
    color: "text-[#01FF95]",
    bgColor: "bg-[#01FF95]/10 hover:bg-[#01FF95]/20",
  },
};

export default function MusicPlatforms({
  links,
  isLight = false,
}: MusicPlatformsProps) {
  // Se não houver links, não renderiza nada
  if (!links || links.length === 0) {
    return null;
  }

  // Separa links com embed e sem embed
  const embedLinks = links.filter((link) => link.embedUrl);
  const cardLinks = links.filter((link) => !link.embedUrl);

  return (
    <div className="text-center mb-12">
      <h1
        className="my-6 font-sans text-3xl font-bold tracking-tight text-balance"
        style={{ color: isLight ? "#000000" : "#ffffff" }}
      >
        Ouça agora
      </h1>

      {/* Embeds - Mostrados primeiro */}
      {embedLinks.length > 0 && (
        <div className="mb-8 flex flex-col gap-6 max-w-3xl mx-auto">
          {embedLinks.map((link) => {
            const aspectRatio =
              link.type === "SPOTIFY" ? "aspect-[16/4]" : "aspect-[16/9]";

            return (
              <div
                key={link.id}
                className={`overflow-hidden rounded-xl shadow-2xl ${aspectRatio} w-full`}
              >
                <iframe
                  src={link.embedUrl!}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="h-full w-full"
                  title={link.title}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Cards - Para links sem embed */}
      {cardLinks.length > 0 && (
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          {cardLinks.map((link) => {
            const config = platformConfig[link.type] || platformConfig.SPOTIFY;
            const Icon = config.icon;

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  backdrop-blur-xl rounded-xl p-6 border shadow-xl
                  transition-all duration-300 flex flex-col items-center justify-center gap-3
                  hover:scale-105 hover:shadow-2xl
                  ${
                    isLight
                      ? "bg-black/5 border-black/10 hover:bg-black/10"
                      : "bg-white/10 border-white/20 hover:bg-white/15"
                  }
                `}
              >
                <Icon className={`w-12 h-12 ${config.color}`} />
                <span
                  className="font-medium text-sm"
                  style={{ color: isLight ? "#000000" : "#ffffff" }}
                >
                  {link.title}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
