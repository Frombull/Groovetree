"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import {
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaChevronDown,
  FaCalendar,
  FaHeart,
  FaChartLine,
  FaCopy,
} from "react-icons/fa";

interface User {
  id: string;
  name: string | null;
  email: string;
  page?: {
    slug: string;
    avatarUrl?: string | null;
  } | null;
}

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
    await logout();
  };

  const avatarUrl = user.page?.avatarUrl || "/default-profile-picture.png";

  return (
    <div className="relative" ref={menuRef}>
      {/* PFP com Username - responsivo */}
      <button
        data-cy="user-menu"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-2 py-2 md:px-3 rounded-full hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 md:min-w-[220px] gap-2 md:gap-3 cursor-pointer"
      >
        <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden border-2 border-white/30 hover:border-purple-400 transition-all shadow-lg flex-shrink-0">
          {user.page?.avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={user.name || "User"}
              width={56}
              height={56}
              className="w-full h-full object-cover "
              unoptimized={avatarUrl.startsWith("http")}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <FaUser className="text-white text-lg md:text-2xl" />
            </div>
          )}
        </div>
        <div className="hidden md:block flex-1 text-left">
          <span className="text-white font-bold text-sm lg:text-base">
            {user.name || "User"}
          </span>
        </div>
        <FaChevronDown
          className={`hidden md:block text-white text-xs transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-200 dark:ring-purple-600">
                {user.page?.avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={user.name || "User"}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized={avatarUrl.startsWith("http")}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <FaUser className="text-white text-xl" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link
              href={`/${user.page?.slug}` || "/"}
              className={`flex items-center px-4 py-2.5 text-sm transition-all group ${
                pathname === `/${user.page?.slug}`
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaUser
                className={`mr-3 transition-colors ${
                  pathname === `/${user.page?.slug}`
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                }`}
              />
              Your Page
            </Link>

            <Link
              href="/dashboard/edit"
              className={`flex items-center px-4 py-2.5 text-sm transition-all group ${
                pathname === "/dashboard/edit"
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaCopy
                className={`mr-3 transition-colors ${
                  pathname === "/dashboard/edit"
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                }`}
              />
              Page Settings
            </Link>

            <div className="border-t border-gray-100 dark:border-gray-800 my-2 mx-2"></div>

            <Link
              href="/dashboard/analytics"
              className={`flex items-center px-4 py-2.5 text-sm transition-all group ${
                pathname === "/dashboard/analytics"
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaChartLine
                className={`mr-3 transition-colors ${
                  pathname === "/dashboard/analytics"
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                }`}
              />
              Analytics
            </Link>

            <Link
              href="/dashboard/calendar"
              className={`flex items-center px-4 py-2.5 text-sm transition-all group ${
                pathname === "/dashboard/calendar"
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaCalendar
                className={`mr-3 transition-colors ${
                  pathname === "/dashboard/calendar"
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                }`}
              />
              Artist Shows
            </Link>

            <Link
              href="/dashboard/favorites"
              className={`flex items-center px-4 py-2.5 text-sm transition-all group ${
                pathname === "/dashboard/favorites"
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaHeart
                className={`mr-3 transition-colors ${
                  pathname === "/dashboard/favorites"
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                }`}
              />
              Favorite Artists
            </Link>

            <Link
              href="/settings"
              className={`flex items-center px-4 py-2.5 text-sm transition-all group ${
                pathname === "/settings"
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FaCog
                className={`mr-3 transition-colors ${
                  pathname === "/settings"
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                }`}
              />
              User Settings
            </Link>

            <div className="border-t border-gray-100 dark:border-gray-800 my-2 mx-2"></div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              data-cy="logout-button"
            >
              {isLoggingOut ? (
                <div className="w-4 h-4 mr-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaSignOutAlt className="mr-3 group-hover:translate-x-0.5 transition-transform" />
              )}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
