"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  isLight: boolean;
  textColor?: string | null;
}

export function BackButton({ isLight, textColor }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed left-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110 cursor-pointer"
      style={{
        backgroundColor: isLight
          ? "rgba(0, 0, 0, 0.1)"
          : "rgba(255, 255, 255, 0.1)",
        color: textColor || (isLight ? "#000000" : "#ffffff"),
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  );
}
