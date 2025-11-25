"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaTimes,
  FaCopy,
  FaCheck,
  FaFacebook,
  FaWhatsapp,
  FaEnvelope,
  FaRedditAlien,
  FaLinkedin,
  FaLink,
} from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import toast from "react-hot-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistName: string;
  artistTitle: string;
  artistSlug: string;
  avatarUrl?: string;
  isLight: boolean;
  pageId?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  artistName,
  artistTitle,
  artistSlug,
  avatarUrl,
  isLight,
  pageId,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${artistSlug}`
      : "";
  const shareText = `Confira ${artistTitle} no Groovetree!`;

  const trackShare = async (platform: string) => {
    if (!pageId) return;
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageId,
          type: "share",
          platform,
        }),
      });
    } catch (error) {
      console.error("Error tracking share:", error);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    trackShare("copy");
    setTimeout(() => setCopied(false), 2000);
  };

  const getSocialPlatforms = () => [
    {
      name: "Copiar",
      icon: <FaLink className="w-5 h-5" />,
      color: "bg-gray-600 hover:bg-gray-700",
      action: "copy",
      platform: "copy",
    },
    {
      name: "X",
      icon: <BsTwitterX className="w-5 h-5" />,
      color: "bg-black hover:bg-gray-800",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      platform: "twitter",
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="w-5 h-5" />,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      platform: "facebook",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="w-5 h-5" />,
      color: "bg-green-500 hover:bg-green-600",
      url: `https://wa.me/?text=${encodeURIComponent(
        `${shareText} ${shareUrl}`
      )}`,
      platform: "whatsapp",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-5 h-5" />,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
        shareText
      )} ${encodeURIComponent(shareUrl)}`,
      platform: "linkedin",
    },
  ];

  const handleSocialShare = (url: string, platform: string) => {
    trackShare(platform);
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[20000] p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Share Groovetree
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Artist Card */}
        <div className="px-6 pt-6 pb-4">
          <div
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 text-center"
            style={{
              background: avatarUrl
                ? "linear-gradient(135deg, rgb(126, 34, 206) 0%, rgb(168, 85, 247) 100%)"
                : "linear-gradient(135deg, rgb(30, 30, 30) 0%, rgb(10, 10, 10) 100%)",
            }}
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={artistTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                  {artistTitle.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex justify-center items-center gap-2 mb-1">
              <h3 className="text-white font-bold text-xl">{artistTitle}</h3>
              <Image
                src="/verified-icon.png"
                alt="Verified"
                width={24}
                height={24}
                className="flex-shrink-0"
              />
            </div>
            <p className="text-gray-300 text-sm font-mono">
              groovetr.ee/{artistSlug}
            </p>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="px-6 pb-6">
          <p className="text-sm text-gray-600 mb-4 text-center">
            Junte-se a {artistName} no Groovetree
          </p>
          <div className="flex gap-3 justify-center mb-6">
            {getSocialPlatforms().map((platform) => (
              <button
                key={platform.name}
                onClick={() =>
                  platform.action === "copy"
                    ? handleCopyUrl()
                    : handleSocialShare(platform.url!, platform.platform)
                }
                className={`w-12 h-12 rounded-full ${platform.color} text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer`}
                title={
                  platform.action === "copy"
                    ? copied
                      ? "Link copiado!"
                      : "Copiar link"
                    : `Compartilhar no ${platform.name}`
                }
              >
                {platform.action === "copy" && copied ? (
                  <FaCheck className="w-5 h-5" />
                ) : (
                  platform.icon
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
