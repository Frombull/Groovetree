"use client";

import Link from "next/link";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaSpotify,
} from "react-icons/fa";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";

function SignupContent() {
  const searchParams = useSearchParams();
  const usernameFromUrl = searchParams.get("username") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(usernameFromUrl);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  // Atualizar o campo name quando o username da URL mudar
  useEffect(() => {
    if (usernameFromUrl) {
      setName(usernameFromUrl);
    }
  }, [usernameFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 3) {
      setError("Password too short");
      return;
    }

    setLoading(true);

    const result = await signup(email, password, name || undefined);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Error creating account");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex font-sans relative">
      {/* Botão de voltar */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
        title="Back to home"
      >
        <FaArrowLeft className="w-5 h-5" />
      </Link>
      {/* Left */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/signup-page-bg.webp')" }}
      ></div>

      {/* Right */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-white text-gray-800">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Join Groovetree!</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="sr-only">
                Name*
              </label>
              <input
                id="name"
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email*
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Password*
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  required
                  minLength={3}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#483D8B] text-white font-semibold py-3 rounded-md hover:bg-[#3A316E] transition disabled:opacity-50 cursor-pointer"
              data-cy="signup-button"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm font-semibold text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                window.location.href = '/api/auth/oauth/google?mode=signup';
              }}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-3 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              <FaGoogle />
              Sign up with Google
            </button>
            <button
              onClick={() => {
                window.location.href = '/api/auth/oauth/spotify?mode=signup';
              }}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-3 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              <FaSpotify />
              Sign up with Spotify
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-600 hover:underline font-semibold"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-pink-600 to-red-600">
          <div className="text-white text-xl">Carregando...</div>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
