"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Music,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
  Music2,
  Calendar
} from "lucide-react";

interface ArtistLink {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface ArtistEvent {
  id: string;
  title: string;
  venue: string;
  city: string;
  state: string | null;
  date: string;
  ticketUrl: string | null;
}

interface Artist {
  id: string;
  slug: string;
  title: string;
  bio: string | null;
  avatarUrl: string | null;
  backgroundColor: string | null;
  links: ArtistLink[];
  events: ArtistEvent[];
}

const getLinkIcon = (type: string) => {
  switch (type) {
    case "SPOTIFY":
      return <Music className="w-5 h-5" />;
    case "APPLE_MUSIC":
      return <Music2 className="w-5 h-5" />;
    case "INSTAGRAM":
      return <Instagram className="w-5 h-5" />;
    case "FACEBOOK":
      return <Facebook className="w-5 h-5" />;
    case "YOUTUBE":
      return <Youtube className="w-5 h-5" />;
    case "SOUNDCLOUD":
      return <Music className="w-5 h-5" />;
    default:
      return <ExternalLink className="w-5 h-5" />;
  }
};

export default function FeaturedArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/featured-artists")
      .then((res) => res.json())
      .then((data) => {
        setArtists(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading artists:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-8 md:px-16">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured <span className="text-purple-600">Artists</span>
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse w-[240px] h-[480px]">
                <div className="p-6 flex flex-col items-center h-full">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mb-4" />
                  <div className="h-5 w-24 bg-gray-300 rounded mb-2" />
                  <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
                  <div className="flex gap-2 mt-auto">
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (artists.length === 0) {
    return null;
  }

  return (
    <section id="featured-artists" className="py-20 bg-gray-50">
      <div className="container mx-auto px-8 md:px-16">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Featured <span className="text-purple-600">Artists</span>
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {artists.slice(0, 5).map((artist) => {
            const bgColor = artist.backgroundColor || "#8B5CF6";

            return (
              <div
                key={artist.id}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 w-[240px] h-[480px]"
                style={{ backgroundColor: bgColor }}>
                <Link href={`/${artist.slug}`} className="block p-6 h-full">
                  <div className="flex flex-col items-center h-full">
                    {/* Avatar */}
                    <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden border-2 border-white/10 shadow-lg flex-shrink-0">
                      {artist.avatarUrl ? (
                        <Image
                          src={artist.avatarUrl}
                          alt={artist.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                          <Music className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Artist name */}
                    <h4 className="text-[20px] font-bold text-white text-center mb-1 line-clamp-2">
                      {artist.title}
                    </h4>

                    {/* Bio */}
                    {artist.bio && (
                      <p className="text-sm text-white/80 text-center mb-4 line-clamp-2">
                        {artist.bio}
                      </p>
                    )}

                    {/* Shows */}
                    {artist.events && artist.events.length > 0 && (
                      <div className="w-full mb-3 flex-grow">
                        {artist.events.slice(0, 2).map((event) => {
                          const eventDate = new Date(event.date);
                          const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
                          const day = eventDate.getDate();

                          return (
                            <div
                              key={event.id}
                              className="bg-white/10 backdrop-blur-sm rounded-lg p-2 mb-2 text-white text-xs"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-shrink-0 text-center">
                                  <Calendar className="w-4 h-4 mx-auto mb-1" />
                                  <div className="font-bold">{month}</div>
                                  <div className="text-lg font-bold leading-none">{day}</div>
                                </div>
                                <div className="flex-grow min-w-0">
                                  <div className="font-semibold truncate">{event.city}</div>
                                  <div className="text-white/70 truncate text-[10px]">{event.venue}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Links */}
                    {artist.links && artist.links.length > 0 && (
                      <div className="flex gap-2 flex-wrap justify-center mt-auto">
                        {artist.links.slice(0, 4).map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
                            title={link.title}
                          >
                            <div className="text-white">
                              {getLinkIcon(link.type)}
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
