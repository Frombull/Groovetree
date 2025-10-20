"use client";

import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import ArtistSearch from "./ArtistSearch";

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // se for /settings, não mostra os links
  const hideNav = pathname === "/settings";

  return (
    <header className="relative z-10 pt-8 px-8 md:px-16">
      <div className="container mx-auto">
        <div className="bg-transparent rounded-4xl shadow-2xl px-4 md:px-8 py-4 md:py-6">
          {/* Layout em grid para melhor distribuição */}
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Logo e navegação à esquerda */}
            <div className="flex items-center space-x-8">
              <Link href="/">
                <h1 className="text-2xl md:text-3xl font-light text-white bg-clip-text cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap">
                  Groovetree
                </h1>
              </Link>

              {!hideNav && (
                <nav className="hidden lg:flex items-center space-x-6">
                  <a
                    href="#features"
                    className="text-gray-300 dark:text-gray-300 hover:text-purple-400 transition-colors text-sm"
                  >
                    Resources
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-gray-300 dark:text-gray-300 hover:text-purple-400 transition-colors text-sm"
                  >
                    How it works
                  </a>
                </nav>
              )}
            </div>

            {/* Barra de pesquisa centralizada */}
            <div className="hidden md:flex justify-center">
              <ArtistSearch />
            </div>

            {/* Botões de autenticação à direita */}
            <div className="flex items-center justify-end space-x-2 md:space-x-4">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-10 w-20 rounded-full"></div>
              ) : user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Link href="/login">
                    <button
                      className="bg-transparent hover:opacity-90 dark:text-gray-300 text-gray-300 font-semibold py-2 px-3 md:px-6 rounded-full border border-gray-300 hover:border-purple-400 transition-all cursor-pointer text-sm md:text-base"
                      data-cy="login-button-header"
                    >
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button
                      className="bg-transparent hover:opacity-90 dark:text-gray-300 text-gray-300 font-semibold py-2 px-3 md:px-6 rounded-full border border-gray-300 hover:border-purple-400 transition-all cursor-pointer text-sm md:text-base"
                      data-cy="signup-button-header"
                    >
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Barra de pesquisa mobile (abaixo em mobile) */}
          <div className="md:hidden mt-4">
            <ArtistSearch />
          </div>
        </div>
      </div>
    </header>
  );
}
