import Footer from '@/app/components/footer';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Artistcard from '@/app/components/artist-card';

export default function Home() {
  return (
    <div className="font-sans">
      <div className="min-h-screen bg-[#1A0C4E] text-white">
        {/* Header */}
        <header className="py-6 px-8 md:px-16">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-12">
              <h1 className="text-3xl font-bold">Groovetree</h1>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Sample Text</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Sample Text</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Sample Text</a>
              </nav>
            </div>

            {/* Search bar */}
            <div className="flex items-center space-x-6">
              <div className="relative hidden lg:block">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search artists..."
                  className="bg-[#2A1B5D] border border-transparent focus:border-purple-500 focus:ring-0 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 transition-colors"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <button className="bg-transparent hover:bg-[#2A1B5D] text-white font-semibold py-2 px-6 rounded-full transition-colors cursor-pointer">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-white text-[#1A0C4E] font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                    Sign up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-8 md:px-16 text-center md:text-left mt-24 md:mt-32 pb-32">
          <h2 className="text-6xl md:text-8xl font-bold leading-tight">
            Aqui você conecta<br />
            o público<br />
            ao seu som
          </h2>

          <div className="mt-12 flex justify-center md:justify-start">
            <div className="relative flex items-center w-full max-w-lg">
              <span className="absolute left-4 text-gray-400">groovetree.com.br/</span>
              <input
                type="text"
                className="w-full bg-white/20 backdrop-blur-sm rounded-full py-4 pl-48 pr-32 text-white placeholder-gray-300 border border-transparent focus:border-purple-400 focus:ring-0"
              />
              <button className="absolute right-2 bg-white text-[#1A0C4E] font-semibold py-2.5 px-6 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                Claim Now
              </button>
            </div>
          </div>
        </main>
      </div>

      <Artistcard />

      {/* Footer */}
      <Footer />
    </div>
  );
}