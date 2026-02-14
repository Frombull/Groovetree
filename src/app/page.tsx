"use client";

import Header from "@/app/components/header";
import {
  FaSpotify,
  FaSoundcloud,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaApple,
  FaTwitter,
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
      <section
        id="features"
        className="py-20 bg-white relative overflow-hidden"
      >
        <div className="container mx-auto px-8 md:px-16 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Connect All Your Platforms
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bring together all your music streaming services, social media
              profiles, and content platforms in one beautiful page. Make it
              easy for your fans to follow you everywhere.
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
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                One Link, Infinite Reach
              </h4>
              <p className="text-gray-600">
                Share a single link that connects your audience to all your
                music platforms, social media, and content in one place.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Always Up to Date
              </h4>
              <p className="text-gray-600">
                Update your links anytime without changing what you share. Your
                fans always see your latest releases and content.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Fully Customizable
              </h4>
              <p className="text-gray-600">
                Personalize your page with custom colors, layouts, and branding
                to match your unique artistic identity.
              </p>
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
