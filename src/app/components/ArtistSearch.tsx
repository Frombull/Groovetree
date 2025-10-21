"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, User } from "lucide-react";
import Image from "next/image";

interface Artist {
  slug: string;
  title: string;
  avatarUrl: string | null;
  bio: string | null;
  user: {
    name: string | null;
  };
}

export default function ArtistSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Artist[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fechar o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Buscar artistas
  useEffect(() => {
    const searchArtists = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setResults(data.artists || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Error searching artists:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchArtists, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelectArtist = (slug: string) => {
    router.push(`/${slug}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full md:w-80 lg:w-96">
      {/* Input de busca */}
      <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:border-purple-400/50 transition-all shadow-lg hover:shadow-purple-500/20">
        <Search className="ml-4 text-gray-300" size={20} />
        <input
          type="text"
          placeholder="Search for artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="flex-1 bg-transparent text-white placeholder-white text-sm py-3 px-3 focus:outline-none rounded-full"
        />
        {isLoading && (
          <div className="mr-4 animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
        )}
      </div>

      {/* Menu dropdown com resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-3 w-full bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-96 overflow-y-auto">
            {results.map((artist) => (
              <button
                key={artist.slug}
                onClick={() => handleSelectArtist(artist.slug)}
                className="w-full flex items-center gap-4 p-4 hover:bg-black/30 backdrop-blur-sm transition-all text-left border-b border-white/20 last:border-b-0 group cursor-pointer"
              >
                {/* Avatar */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex-shrink-0 ring-2 ring-white/40 group-hover:ring-purple-300/80 transition-all shadow-lg">
                  {artist.avatarUrl ? (
                    <Image
                      src={artist.avatarUrl}
                      alt={artist.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="text-white" size={28} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white drop-shadow-lg truncate group-hover:text-purple-300 transition-colors">
                    {artist.title}
                  </h4>
                  <p className="text-sm text-white/80 drop-shadow truncate">
                    @{artist.slug}
                    {artist.user.name && ` • ${artist.user.name}`}
                  </p>
                </div>

                {/* Ícone de seta */}
                <svg
                  className="w-5 h-5 text-white/70 group-hover:text-purple-300 group-hover:translate-x-1 transition-all drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem quando não há resultados */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full mt-3 w-full bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 p-6 text-center z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/40">
              <Search className="text-white drop-shadow-lg" size={24} />
            </div>
            <p className="text-white font-semibold drop-shadow-lg text-sm">
              No artists found
            </p>
            <p className="text-xs text-white/90 drop-shadow">
              Try searching with a different name
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
