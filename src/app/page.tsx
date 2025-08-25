import Footer from '@/app/components/footer';
import Header from '@/app/components/header';
import { FaMusic, FaHeadphones, FaUsers, FaRocket, FaSpotify, FaSoundcloud, FaYoutube, FaInstagram, FaTiktok, FaApple } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-[#1A0C4E] via-[#2D1B69] to-[#4C1D95] text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-[#2D1B69] rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Header */}
        <Header />

        {/* Hero Content */}
        <main className="relative z-10 container mx-auto px-8 md:px-16 text-center mt-20 md:mt-32 pb-32">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              Here, you connect the audience to
              <span className="bg-gradient-to-r from-purple-400 to-[#4C1D95] bg-clip-text text-transparent"> your sound </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Create your personalized page and connect your fans to all your music platforms in one place.
              The ultimate Musictree for DJs and artists.
            </p>

            {/* URL Input */}
            <div className="mb-12 flex justify-center">
              <div className="relative flex items-center w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
                <span className="text-gray-300 pl-6 text-lg">groovetree.com.br/</span>
                <input
                  type="text"
                  placeholder=""
                  className="flex-1 bg-transparent text-gray-300 placeholder-gray-400 text-lg py-4 focus:outline-none"
                />
                <button className="bg-gradient-to-tl from-[#2D1B69] to-[#4C1D95] text-white font-semibold py-4 px-8 rounded-xl hover:from-[#1A0C4E] hover:to-[#2D1B69] transition-all cursor-pointer shadow-lg">
                  Create Page
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">0+</div>
                <div className="text-gray-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">0+</div>
                <div className="text-gray-300">Monthly Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">0+</div>
                <div className="text-gray-300">Status Info</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-8 md:px-16">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AAAAAAAAAAAAAAA <span className="text-purple-600">AAAAAAAAAAA</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <FaMusic className="text-purple-600 text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex justify-center">Links</h4>
              <p className="text-gray-600">Connect Spotify, Apple Music, SoundCloud and all your favorite platforms</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <FaHeadphones className="text-[#2D1B69] text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex justify-center">Embed Player</h4>
              <p className="text-gray-600">Your fans can listen to your music directly on your page</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex justify-center">Analytics</h4>
              <p className="text-gray-600">Track clicks, views, and engagement in real time</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <FaRocket className="text-green-600 text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex justify-center">Customization</h4>
              <p className="text-gray-600">Custom themes that match your musical style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Icons Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-8 md:px-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Connect all your platforms
          </h3>
          <p className="text-xl text-gray-600 mb-12">
            We support major music and social media platforms
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <FaSpotify className="text-5xl text-green-500 hover:scale-110 transition-transform" />
            <FaApple className="text-5xl text-gray-800 hover:scale-110 transition-transform" />
            <FaSoundcloud className="text-5xl text-orange-500 hover:scale-110 transition-transform" />
            <FaYoutube className="text-5xl text-red-500 hover:scale-110 transition-transform" />
            <FaInstagram className="text-5xl text-[#4C1D95] hover:scale-110 transition-transform" />
            <FaTiktok className="text-5xl text-black hover:scale-110 transition-transform" />
            <FaXTwitter className="text-5xl text-black hover:scale-110 transition-transform" />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-8 md:px-16">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How it works
            </h3>
            <p className="text-xl text-gray-600">
              In 3 simple steps, your page will be live!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Create your account</h4>
              <p className="text-gray-600 text-lg">
                Sign up for free and choose your unique username
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Add your links</h4>
              <p className="text-gray-600 text-lg">
                Connect your social networks, music platforms, and other important links
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Share</h4>
              <p className="text-gray-600 text-lg">
                Use your custom page on shows, social media, and promotional materials
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] text-white">
        <div className="container mx-auto px-8 md:px-16 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to create your own page?
          </h3>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <button className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-lg shadow-lg">
                Get Started for Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}