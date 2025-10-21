"use client";

import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import ArtistSearch from "./ArtistSearch";
import { FaHome, FaEdit } from "react-icons/fa";

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // se for /settings, não mostra os links e pesquisa
  const isSettingsPage = pathname === "/settings";

  return (
    <header className="relative z-10 pt-4 md:pt-8 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto">
        <div className="bg-transparent rounded-4xl shadow-2xl px-3 md:px-4 lg:px-8 py-3 md:py-4 lg:py-6">
          {/* Layout flexível para melhor responsividade */}
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Logo */}
            <div className="flex items-center space-x-4 lg:space-x-10">
              <Link href="/">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white bg-clip-text cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap">
                  Groovetree
                </h1>
              </Link>

              {!isSettingsPage && (
                <nav className="hidden lg:flex items-center space-x-6">
                  <a
                    href="#features"
                    className="text-gray-300 dark:text-gray-300 hover:text-purple-400 transition-colors text-sm font-bold "
                  >
                    Resources
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-gray-300 dark:text-gray-300 hover:text-purple-400 transition-colors text-sm font-bold "
                  >
                    How it works
                  </a>
                </nav>
              )}
            </div>

            {/* Centro - Botões de navegação settings ou Pesquisa */}
            {isSettingsPage ? (
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-6">
                  <Link href="/">
                    <span className="flex items-center gap-2 text-base md:text-lg text-white font-semibold hover:text-purple-400 transition-colors cursor-pointer whitespace-nowrap">
                      <FaHome className="text-sm md:text-base" />
                      Home
                    </span>
                  </Link>
                  <Link href="/dashboard/edit">
                    <span className="flex items-center gap-2 text-base md:text-lg text-white font-semibold hover:text-purple-400 transition-colors cursor-pointer whitespace-nowrap">
                      <FaEdit className="text-sm md:text-base" />
                      Edit Page
                    </span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex-1 hidden md:flex justify-center mx-2 md:mx-4">
                <div className="w-full max-w-md">
                  <ArtistSearch />
                </div>
              </div>
            )}

            {/* Botões de autenticação à direita */}
            <div className="flex items-center justify-end space-x-2">
              {/* Lupa mobile - aparece apenas em mobile e não em settings */}
              {!isSettingsPage && (
                <div className="md:hidden">
                  <ArtistSearch isMobile />
                </div>
              )}

              {loading ? (
                <div className="animate-pulse bg-gray-200 h-10 w-10 md:w-20 rounded-full"></div>
              ) : user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Link href="/login">
                    <button
                      className="bg-transparent hover:opacity-90 dark:text-gray-300 text-gray-300 font-semibold py-2 px-3 md:px-6 rounded-full border border-gray-300 hover:border-purple-400 transition-all cursor-pointer text-sm md:text-base whitespace-nowrap"
                      data-cy="login-button-header"
                    >
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button
                      className="bg-transparent hover:opacity-90 dark:text-gray-300 text-gray-300 font-semibold py-2 px-3 md:px-6 rounded-full border border-gray-300 hover:border-purple-400 transition-all cursor-pointer text-sm md:text-base whitespace-nowrap"
                      data-cy="signup-button-header"
                    >
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
