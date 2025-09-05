'use client';

import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import UserMenu from './UserMenu';

export default function Header() {
  const { user, loading } = useAuth();
  return (
    <header className="relative z-10 pt-8 px-8 md:px-16">
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-4xl shadow-lg px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
          <div className="flex items-center space-x-12">
            <Link href="/">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity">
                Groovetree
              </h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Resources</a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">How it works</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Pricing</a>
            </nav>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative hidden lg:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search artist..."
                className="pl-10 pr-4 py-2 w-64 xl:w-80 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400 text-gray-900 caret-gray-900"
              />
            </div>
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-10 w-20 rounded-full"></div>
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link href="/login">
                  <button 
                  className="bg-transparent hover:bg-gray-100 dark:text-gray-300 text-gray-700 font-semibold py-2 px-3 md:px-6 rounded-full border border-gray-300 transition-all cursor-pointer text-sm md:text-base"
                  data-cy="login-button-header">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-3 md:px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer shadow-lg text-sm md:text-base"
                  data-cy="signup-button-header">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}