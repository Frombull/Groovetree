"use client";

import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

interface Link {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface SocialLinksProps {
  links: Link[];
  isLight?: boolean;
}

// Mapeamento de ícones por tipo
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  INSTAGRAM: Instagram,
  TWITTER: Twitter,
  YOUTUBE: Youtube,
  FACEBOOK: Facebook,
  TIKTOK: FaTiktok,
};

export function SocialLinks({ links, isLight = false }: SocialLinksProps) {
  // Se não houver links, não renderiza nada
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex flex-wrap justify-center gap-3">
        {links.map((link) => {
          const Icon = iconMap[link.type] || Instagram;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.title}
              title={link.title}
              className={`
              p-4 rounded-xl backdrop-blur-xl border shadow-xl
              transition-all duration-300 hover:scale-110
              ${
                isLight
                  ? "bg-black/5 border-black/10 hover:bg-black/10"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }
              `}
            >
              <Icon
                className={`h-5 w-5 ${isLight ? "text-black" : "text-white"}`}
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
