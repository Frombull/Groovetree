"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";

export function ArtistProfile({
  name,
  avatarUrl,
  title,
  bio,
}: {
  name?: string | null;
  avatarUrl?: string;
  title: string;
  bio?: string | null;
}) {
  return (
    <div className="mb-12 text-center">
      <Avatar className="mx-auto h-32 w-32 border-4 border-primary">
        <AvatarImage src={avatarUrl} alt="Artist" />
        <AvatarFallback className="bg-secondary text-foreground text-4xl">
          DJ
        </AvatarFallback>
      </Avatar>
      <h1 className="mt-6 font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl text-balance">
        {title}
      </h1>
      {bio && (
        <p className="mx-auto mt-6 max-w-md text-sm text-white/70 text-pretty">
          {bio}
        </p>
      )}
    </div>
  );
}
