"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, User, X } from "lucide-react";
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

interface ArtistSearchProps {
  isMobile?: boolean;
}

export default function ArtistSearch({ isMobile = false }: ArtistSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Artist[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fechar o modal ao pressionar ESC
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setIsOpen(false);
        setQuery("");
      }
    }

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

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
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsOpen(false);
    setQuery("");
  };

  // Versão mobile - apenas ícone de lupa
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 hover:border-purple-400/50 transition-all shadow-lg cursor-pointer"
        >
          <Search className="text-gray-300" size={20} />
        </button>

        {/* Modal centralizado */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Overlay translúcido */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Conteúdo do modal */}
            <div
              ref={searchRef}
              className="relative w-full max-w-2xl bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
            >
              {/* Header do modal */}
              <div className="flex items-center gap-3 p-4 border-b border-white/20">
                <Search className="text-gray-300" size={24} />
                <input
                  type="text"
                  placeholder="Search for artists..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent text-white placeholder-gray-300 text-lg focus:outline-none"
                />
                {isLoading && (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                )}
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="text-gray-300" size={24} />
                </button>
              </div>

              {/* Resultados */}
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length > 0 ? (
                  results.map((artist) => (
                    <button
                      key={artist.slug}
                      onClick={() => handleSelectArtist(artist.slug)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-white/10 transition-all text-left border-b border-white/10 last:border-b-0 group cursor-pointer"
                    >
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
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white drop-shadow-lg truncate group-hover:text-purple-300 transition-colors">
                          {artist.title}
                        </h4>
                        <p className="text-sm text-white/80 drop-shadow truncate">
                          @{artist.slug}
                          {artist.user.name && ` • ${artist.user.name}`}
                        </p>
                      </div>
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
                  ))
                ) : query.length >= 2 && !isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/40 mb-4">
                      <Search className="text-white drop-shadow-lg" size={32} />
                    </div>
                    <p className="text-white font-semibold drop-shadow-lg text-lg mb-2">
                      No artists found
                    </p>
                    <p className="text-sm text-white/80 drop-shadow">
                      Try searching with a different name
                    </p>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-white/60 text-sm">
                      Start typing to search for artists...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Versão desktop - input completo sempre visível
  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:border-purple-400/50 transition-all shadow-lg hover:shadow-purple-500/20">
        <Search className="ml-4 text-gray-300" size={20} />
        <input
          type="text"
          placeholder="Search for artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="flex-1 bg-transparent text-white placeholder-gray-300 text-sm py-3 px-3 focus:outline-none rounded-full"
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
