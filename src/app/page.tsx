"use client";

import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import {
  FaSpotify,
  FaSoundcloud,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaApple,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import Features from "./components/Features";
import Aurora from "./components/Aurora";
import TextType from "./components/TextType";
import CircularText from "./components/CircularText";

export default function Home() {
  return (
    <div className="font-sans overflow-x-hidden relative">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br bg-[#060010] text-white overflow-hidden">
        {/* Background Elements */}
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />

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
                  "Create your personalized page and connect your fans to all your music platforms in one place. The ultimate Musictree for DJs and artists.",
                  "Unite your music, socials, and fans with a single, beautiful link.",
                  "Grow your audience by sharing all your music and profiles in one spot.",
                  "Make it easy for fans to find your latest tracks and follow you everywhere.",
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
                <div className="relative flex items-center w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
                  <span className="text-gray-300 pl-6 text-lg">
                    groovetree.vercel.app/
                  </span>
                  <input
                    type="text"
                    id="username-input"
                    placeholder=""
                    className="flex-1 bg-transparent text-gray-300 placeholder-gray-400 text-lg py-4 focus:outline-none"
                  />
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
                    className="bg-gradient-to-tl from-[#2D1B69] to-[#4C1D95] text-white font-semibold py-4 px-8 rounded-xl hover:from-[#1A0C4E] hover:to-[#2D1B69] transition-all cursor-pointer shadow-lg"
                  >
                    Create Page
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="absolute z-40 -right-14 top-[800px]">
        <CircularText
          text="GROOVE*TREE*GROOVE*TREE*"
          onHover="speedUp"
          spinDuration={20}
        />
      </div>

      {/* Features Section */}
      <Features />

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
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-purple-50 to-purple-100"
      >
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
      <section className="py-20 bg-gradient-to-r from-[#2D1B69] to-[#4C1D95] text-white">
        <div className="container mx-auto px-8 md:px-16 text-center">
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
