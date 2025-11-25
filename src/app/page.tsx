"use client";

import Header from "@/app/components/header";
import {
  FaSpotify,
  FaSoundcloud,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaApple,
  FaTwitter
} from "react-icons/fa";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaX, FaXTwitter } from "react-icons/fa6";

const Footer = dynamic(() => import("./components/footer"), {
  ssr: false,
});

// const Aurora = dynamic(() => import("./components/Aurora"), {
//   ssr: false
// });

const TextType = dynamic(() => import("./components/TextType"), {
  ssr: false,
});

const CircularText = dynamic(() => import("./components/CircularText"), {
  ssr: false,
});


export default function Home() {
  return (
    <div className="font-sans overflow-x-hidden relative">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br bg-[#060010] text-white overflow-hidden">
        {/* Background Elements */}
        {/* <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        /> */}

        {/* Header */}
        <div className="z-[9999]">
          <Header />
          <main className="relative container mx-auto px-8 md:px-16 text-center mt-20 md:mt-32 pb-32">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
                Here, you connect the audience to
                <span className="bg-gradient-to-r from-purple-400 to-[#4C1D95] bg-clip-text text-transparent">
                  {" "}
                  your sound{" "}
                </span>
              </h2>
              <TextType
                text={[
                  "Create your personalized page.",
                  "The ultimate Musictree for DJs and artists.",
                  "Unite your music, socials, and fans with a single link.",
                  "Grow your audience by sharing all your music profile.",
                  "Make it easy for fans to find your latest tracks.",
                  "Your music. Your links. Your brand. All together.",
                  "Share your groove. Amplify your reach. Connect with your fans.",
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                textColors={["#d1d5dc "]}
                showCursor={true}
                cursorCharacter="|"
                className="text-xl md:text-2xl min-h-28 max-w-3xl mx-auto"
              />

              {/* URL Input */}
              <div className="mb-12 flex justify-center">
                <div className="w-full max-w-2xl flex flex-col md:flex-row gap-3">
                  {/* Input container */}
                  <div className="relative flex items-center flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
                    <span className="text-gray-300 pl-4 md:pl-6 text-base md:text-lg whitespace-nowrap">
                      groovetr.ee/
                    </span>
                    <input
                      type="text"
                      id="username-input"
                      placeholder=""
                      className="flex-1 bg-transparent text-gray-300 placeholder-gray-400 text-base md:text-lg py-3 md:py-4 focus:outline-none min-w-0"
                    />
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => {
                      const input = document.getElementById(
                        "username-input"
                      ) as HTMLInputElement;
                      const username = input?.value || "";
                      window.location.href = `/signup?username=${encodeURIComponent(
                        username
                      )}`;
                    }}
                    className="bg-gradient-to-tl from-[#2D1B69] to-[#4C1D95] text-white font-semibold py-4 px-8 rounded-xl hover:from-[#1A0C4E] hover:to-[#2D1B69] transition-all cursor-pointer shadow-lg whitespace-nowrap"
                  >
                    Create Page
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="absolute z-40 -right-14 top-[700px]">
        <CircularText
          text="GROOVE*TREE*GROOVE*TREE*"
          onHover="speedUp"
          spinDuration={20}
        />
      </div>

      {/* Platform Icons Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-8 md:px-16 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Connect All Your Platforms
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bring together all your music streaming services, social media profiles, and content platforms in one beautiful page. Make it easy for your fans to follow you everywhere.
            </p>
          </div>

          {/* Platform Icons Grid */}
          <div className="mb-16 flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <FaSpotify className="text-5xl text-green-500 hover:scale-110 transition-transform" />
            <FaApple className="text-5xl text-gray-800 hover:scale-110 transition-transform" />
            <FaSoundcloud className="text-5xl text-orange-500 hover:scale-110 transition-transform" />
            <FaYoutube className="text-5xl text-red-500 hover:scale-110 transition-transform" />
            <FaInstagram className="text-5xl text-[#4C1D95] hover:scale-110 transition-transform" />
            <FaTiktok className="text-5xl text-black hover:scale-110 transition-transform" />
            <FaXTwitter className="text-5xl text-black hover:scale-110 transition-transform" />
          </div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">One Link, Infinite Reach</h4>
              <p className="text-gray-600">
                Share a single link that connects your audience to all your music platforms, social media, and content in one place.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Always Up to Date</h4>
              <p className="text-gray-600">
                Update your links anytime without changing what you share. Your fans always see your latest releases and content.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Fully Customizable</h4>
              <p className="text-gray-600">
                Personalize your page with custom colors, layouts, and branding to match your unique artistic identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-8 md:px-16">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Track Your Growth
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get powerful insights about your audience and content performance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Features */}
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Page Views Analytics</h4>
                  <p className="text-gray-600 text-lg">Monitor how many people visit your page and track your growth over time</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Link Share Tracking</h4>
                  <p className="text-gray-600 text-lg">See which trees your audience engages with most and optimize your content</p>
                </div>
              </div>


              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Data</h4>
                  <p className="text-gray-600 text-lg">Get instant updates on your page performance and audience engagement</p>
                </div>
              </div>
            </div>

            {/* Right side - Visual representation */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
                  {/* Page Views Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
                    <div className="flex items-center justify-center mb-2 md:mb-3">
                      <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-[10px] md:text-xs font-medium mb-1 text-center">
                      Page Views
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 text-center">
                      15.056
                    </p>
                  </div>

                  {/* Favorites Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
                    <div className="flex items-center justify-center mb-2 md:mb-3">
                      <div className="p-1.5 md:p-2 bg-pink-100 rounded-lg">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-[10px] md:text-xs font-medium mb-1 text-center">
                      Favorites
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 text-center">
                      3.247
                    </p>
                  </div>

                  {/* Shares Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
                    <div className="flex items-center justify-center mb-2 md:mb-3">
                      <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-gray-600 text-[10px] md:text-xs font-medium mb-1 text-center">
                      Shares
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 text-center">
                      1.450
                    </p>
                  </div>
                </div>

                {/* Metrics over time - Area Chart */}
                <div>
                  {/* Header with title and legend */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h5 className="text-sm md:text-base font-semibold text-gray-900">Metrics Over Time</h5>
                    <div className="flex flex-wrap gap-3 md:gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                        <span className="text-gray-600 font-medium">Views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-pink-600"></div>
                        <span className="text-gray-600 font-medium">Favorites</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                        <span className="text-gray-600 font-medium">Shares</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart container */}
                  <div className="relative h-64 md:h-80 bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
                    {/* Chart area with grid */}
                    <div className="relative w-full h-full">
                      {/* Horizontal grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-medium w-10 text-right">15K</span>
                          <div className="flex-1 border-t border-gray-100"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-medium w-10 text-right">12K</span>
                          <div className="flex-1 border-t border-gray-100"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-medium w-10 text-right">9K</span>
                          <div className="flex-1 border-t border-gray-100"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-medium w-10 text-right">6K</span>
                          <div className="flex-1 border-t border-gray-100"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-medium w-10 text-right">3K</span>
                          <div className="flex-1 border-t border-gray-100"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-medium w-10 text-right">0</span>
                          <div className="flex-1 border-t border-gray-200"></div>
                        </div>
                      </div>

                      {/* SVG Chart */}
                      <div className="absolute inset-0 pl-14">
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="gradientPageViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#9333EA" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="gradientFavorites" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="gradientShares" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          {/* Page Views - Purple (12,543) */}
                          <path
                            d="M 0 35 L 42 42 L 83 30 L 125 37 L 167 22 L 208 20 L 250 17 L 292 14 L 333 10 L 375 12 L 417 7 L 458 5 L 500 2 L 500 200 L 0 200 Z"
                            fill="url(#gradientPageViews)"
                          />
                          <path
                            d="M 0 35 L 42 42 L 83 30 L 125 37 L 167 22 L 208 20 L 250 17 L 292 14 L 333 10 L 375 12 L 417 7 L 458 5 L 500 2"
                            fill="none"
                            stroke="#9333EA"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Favorites - Pink (1,247) */}
                          <path
                            d="M 0 183 L 42 180 L 83 178 L 125 175 L 167 171 L 208 169 L 250 166 L 292 164 L 333 161 L 375 159 L 417 156 L 458 154 L 500 151 L 500 200 L 0 200 Z"
                            fill="url(#gradientFavorites)"
                          />
                          <path
                            d="M 0 183 L 42 180 L 83 178 L 125 175 L 167 171 L 208 169 L 250 166 L 292 164 L 333 161 L 375 159 L 417 156 L 458 154 L 500 151"
                            fill="none"
                            stroke="#EC4899"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Shares - Blue (856) */}
                          <path
                            d="M 0 189 L 42 187 L 83 186 L 125 185 L 167 184 L 208 183 L 250 182 L 292 181 L 333 180 L 375 179 L 417 178 L 458 177 L 500 176 L 500 200 L 0 200 Z"
                            fill="url(#gradientShares)"
                          />
                          <path
                            d="M 0 189 L 42 187 L 83 186 L 125 185 L 167 184 L 208 183 L 250 182 L 292 181 L 333 180 L 375 179 L 417 178 L 458 177 L 500 176"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-4 pl-14 pr-1">
                      <span className="text-xs text-gray-400 font-medium">Jan</span>
                      <span className="text-xs text-gray-400 font-medium">Feb</span>
                      <span className="text-xs text-gray-400 font-medium">Mar</span>
                      <span className="text-xs text-gray-400 font-medium">Apr</span>
                      <span className="text-xs text-gray-400 font-medium">May</span>
                      <span className="text-xs text-gray-400 font-medium">Jun</span>
                      <span className="text-xs text-gray-400 font-medium">Jul</span>
                      <span className="text-xs text-gray-400 font-medium">Aug</span>
                      <span className="text-xs text-gray-400 font-medium">Sep</span>
                      <span className="text-xs text-gray-400 font-medium">Oct</span>
                      <span className="text-xs text-gray-400 font-medium">Nov</span>
                      <span className="text-xs text-gray-400 font-medium">Dec</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-purple-50 to-purple-100 relative overflow-hidden"
      >
        {/* Aurora Background */}
        {/* <div className="absolute inset-0 opacity-25">
          <Aurora colorStops={["#f59e0b", "#ec4899", "#8b5cf6"]} />
        </div> */}

        <div className="container mx-auto px-8 md:px-16 relative z-10">
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
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Create your account
              </h4>
              <p className="text-gray-600 text-lg">
                Sign up for free and choose your unique username
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Add your links
              </h4>
              <p className="text-gray-600 text-lg">
                Connect your social networks, music platforms, and other
                important links
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Share</h4>
              <p className="text-gray-600 text-lg">
                Use your custom page on shows, social media, and promotional
                materials
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] text-white relative overflow-hidden">
        {/* Aurora Background */}
        {/* <div className="absolute inset-0 opacity-30">
          <Aurora colorStops={["#06b6d4", "#a855f7", "#ec4899"]} />
        </div> */}

        <div className="container mx-auto px-8 md:px-16 text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to create your own page?
          </h3>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90 break-words">
            Join Groovetree to grow your audience
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
