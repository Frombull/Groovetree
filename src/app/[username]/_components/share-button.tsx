"use client";

import { useState } from "react";
import { RiShareFill } from "react-icons/ri";
import { ShareModal } from "./share-modal";

interface ShareButtonProps {
  pageId: string;
  artistName: string;
  artistTitle: string;
  artistSlug: string;
  avatarUrl?: string | null;
  isLight: boolean;
  textColor?: string | null;
}

export function ShareButton({
  pageId,
  artistName,
  artistTitle,
  artistSlug,
  avatarUrl,
  isLight,
  textColor,
}: ShareButtonProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className="fixed right-16 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110 cursor-pointer"
        style={{
          backgroundColor: isLight
            ? "rgba(0, 0, 0, 0.1)"
            : "rgba(255, 255, 255, 0.1)",
          color: textColor || (isLight ? "#000000" : "#ffffff"),
        }}
        title="Compartilhar"
      >
        <RiShareFill className="w-5 h-5" />
      </button>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        artistName={artistName}
        artistTitle={artistTitle}
        artistSlug={artistSlug}
        avatarUrl={avatarUrl || undefined}
        isLight={isLight}
      />
    </>
  );
}
