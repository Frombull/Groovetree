"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import UserMenu from "@/app/components/UserMenu";
import {
  FaHeart,
  FaHeartBroken,
  FaExternalLinkAlt,
  FaChartLine,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdCalendarMonth, MdImage, MdEdit } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";

interface FavoriteArtist {
  id: string;
  pageId: string;
  slug: string;
  title: string;
  avatarUrl: string | null;
  bio: string | null;
  name: string;
  favoritedAt: string;
}

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteArtist[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setIsLoadingFavorites(true);
      const response = await fetch("/api/favorites/list");

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
      } else {
        console.error("Error loading favorites");
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  const handleRemoveFavorite = async (pageId: string) => {
    try {
      const response = await fetch(`/api/favorites?pageId=${pageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav.pageId !== pageId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 relative overflow-x-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-700 px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap font-[family-name:var(--font-logo)] flex items-center translate-y-0.5">
                Groovetree
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all text-gray-700 dark:text-gray-300"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>

            {/* Desktop Navigation Buttons */}
            <Link
              href="/dashboard/edit"
              className="hidden md:flex p-2 md:px-4 md:py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              title="Edit Page"
            >
              <MdEdit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Page</span>
            </Link>

            <Link
              href="/dashboard/favorites"
              className="hidden md:flex p-2 md:px-4 md:py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 transition-all cursor-pointer items-center gap-2 text-purple-700 dark:text-purple-300 font-semibold"
              title="Favorite Artists"
            >
              <FaHeart className="w-4 h-4" />
              <span className="text-sm font-medium">Favorites</span>
            </Link>

            <Link
              href="/dashboard/calendar"
              className="hidden md:flex p-2 md:px-4 md:py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              title="Artist Shows"
            >
              <MdCalendarMonth className="w-4 h-4" />
              <span className="text-sm font-medium">Calendar</span>
            </Link>

            <Link
              href="/dashboard/analytics"
              className="hidden md:flex p-2 md:px-4 md:py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              title="Analytics"
            >
              <FaChartLine className="w-4 h-4" />
              <span className="text-sm font-medium">Analytics</span>
            </Link>

            <Link
              href="/settings"
              className="hidden md:flex p-2 md:px-4 md:py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              title="Settings"
            >
              <FaCog className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </Link>

            {user && (
              <div className="scale-90">
                <UserMenu user={user} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2">
              <Link
                href="/dashboard/edit"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdEdit className="w-5 h-5" />
                <span>Edit Page</span>
              </Link>
              <Link
                href="/dashboard/favorites"
                className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHeart className="w-5 h-5" />
                <span>Favorites</span>
              </Link>
              <Link
                href="/dashboard/calendar"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdCalendarMonth className="w-5 h-5" />
                <span>Calendar</span>
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaChartLine className="w-5 h-5" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaCog className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Favorite Artists
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length} {favorites.length === 1 ? "artist" : "artists"}{" "}
            in your collection
          </p>
        </div>

        {/* Loading State */}
        {isLoadingFavorites ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : favorites.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <FaHeart className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No favorite artists yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start exploring and add your favorite artists to easily find
                them here.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <FaExternalLinkAlt className="w-4 h-4" />
                Explore Artists
              </Link>
            </div>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-lg hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
              >
                <Link href={`/${favorite.slug}`}>
                  <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center p-12">
                    {favorite.avatarUrl ? (
                      <div className="relative w-3/4 h-3/4 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                        <img
                          src={favorite.avatarUrl}
                          alt={favorite.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-3/4 h-3/4 rounded-full border-4 border-white dark:border-gray-700 shadow-lg flex items-center justify-center text-purple-600 dark:text-purple-400 text-5xl font-bold bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 transition-transform duration-300 group-hover:scale-105">
                        {favorite.name?.slice(0, 2).toUpperCase() ||
                          favorite.title.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <Link href={`/${favorite.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {favorite.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      @{favorite.slug}
                    </p>
                  </Link>

                  {favorite.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {favorite.bio}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/${favorite.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <FaExternalLinkAlt className="w-3 h-3" />
                      View Page
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(favorite.pageId)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      title="Remove from favorites"
                    >
                      <FaHeartBroken className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
