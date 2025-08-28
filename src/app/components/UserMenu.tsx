'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';


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

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
    await logout();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* PFP */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-purple-300 transition-colors">
          <Image
            src={user.page?.avatarUrl || '/default-profile-picture.png'}
            alt={user.name || 'User'}
            width={40}
            height={40}
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={user.page?.avatarUrl || '/default-profile-picture.png'}
                  alt={user.name || 'User'}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-300 truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <Link
              href={user.page?.slug ? `/${user.page.slug}` : '/create-page'}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}>
              <FaUser className="mr-2" />
              My Artist Page
            </Link>

            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}>
              <FaCog className="mr-2" />
              Settings
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoggingOut ? (
                <div className="w-4 h-4 mr-2 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaSignOutAlt className="mr-2" />
              )}
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}