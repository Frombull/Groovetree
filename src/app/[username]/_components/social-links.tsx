"use client";

import { Button } from "@/app/components/ui/button";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";

const socialLinks = [
  { name: "Instagram", icon: Instagram, url: "#" },
  { name: "Twitter", icon: Twitter, url: "#" },
  { name: "YouTube", icon: Youtube, url: "#" },
  { name: "Facebook", icon: Facebook, url: "#" },
];

export function SocialLinks() {
  return (
    <section className="mb-12">
      <div className="flex flex-wrap justify-center gap-3">
        {socialLinks.map((social) => {
          const Icon = social.icon;
          return (
            <Button key={social.name} asChild variant="default" size="lg">
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
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
