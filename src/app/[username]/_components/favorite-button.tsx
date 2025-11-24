"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/hooks/useAuth";

interface FavoriteButtonProps {
  pageId: string;
  isLight: boolean;
}

export function FavoriteButton({ pageId, isLight }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, pageId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites?pageId=${pageId}`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
      }
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Você precisa estar logado para favoritar artistas");
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        // Remover dos favoritos
        const response = await fetch(`/api/favorites?pageId=${pageId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorited(false);
        } else {
          const data = await response.json();
          alert(data.error || "Erro ao remover dos favoritos");
        }
      } else {
        // Adicionar aos favoritos
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pageId }),
        });

        if (response.ok) {
          setIsFavorited(true);
        } else {
          const data = await response.json();
          alert(data.error || "Erro ao adicionar aos favoritos");
        }
      }
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      alert("Erro ao processar a solicitação");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Não mostrar botão se não estiver logado
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="fixed right-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110 disabled:opacity-50 cursor-pointer"
      style={{
        backgroundColor: isLight
          ? "rgba(0, 0, 0, 0.1)"
          : "rgba(255, 255, 255, 0.1)",
      }}
      title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          style={{ color: isLight ? "#000000" : "#ffffff" }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : isFavorited ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
          style={{ color: isLight ? "#000000" : "#ffffff" }}
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
          style={{ color: isLight ? "#000000" : "#ffffff" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      )}
    </button>
  );
}
