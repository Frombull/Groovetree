"use client";

import { Button } from "@/app/components/ui/button";
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
}

// Mapeamento de ícones por tipo
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  INSTAGRAM: Instagram,
  TWITTER: Twitter,
  YOUTUBE: Youtube,
  FACEBOOK: Facebook,
  TIKTOK: FaTiktok,
};

export function SocialLinks({ links }: SocialLinksProps) {
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
            <Button key={link.id} asChild variant="default" size="lg">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.title}
                title={link.title}
              >
                <Icon className="h-5 w-5" />
              </a>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
