"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";

export function ArtistProfile({
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
          DJ
        </AvatarFallback>
      </Avatar>
      <h1
        className="mt-6 font-sans text-4xl font-bold tracking-tight sm:text-5xl text-balance"
        style={{ color: textColor }}
      >
        {title}
      </h1>
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
