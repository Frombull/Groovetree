"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";

export function ArtistProfile({
  name,
  avatarUrl,
  title,
  bio,
  textColor,
}: {
  name?: string | null;
  avatarUrl?: string;
  title: string;
  bio?: string | null;
  textColor?: string;
}) {
  return (
    <div className="mb-12 text-center">
      <Avatar className="mx-auto h-32 w-32 border-4 border-primary">
        <AvatarImage src={avatarUrl} alt="Artist" />
        <AvatarFallback className="bg-secondary text-foreground text-4xl">
          {name && name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex justify-center items-center gap-2 mt-6">
        <h1
          className="font-sans text-4xl font-bold tracking-tight sm:text-5xl text-balance"
          style={{ color: textColor }}
        >
          {title}
        </h1>
        <Image
          src="/verified-icon.png"
          alt="Badge Check"
          className="pt-2"
          width={32}
          height={32}
        />
      </div>
      {bio && (
        <p
          className="mx-auto mt-6 max-w-md text-sm text-pretty"
          style={{ color: textColor, opacity: 0.7 }}
        >
          {bio}
        </p>
      )}
    </div>
  );
}
