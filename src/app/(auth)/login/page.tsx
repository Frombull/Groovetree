import Image from 'next/image';
import Link from 'next/link';
import { FaGoogle, FaGithub } from 'react-icons/fa';


export default function Login() {
    return (
        <div className="min-h-screen flex text-gray-800 bg-white font-sans">

            {/* Left */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
                <div className="w-full max-w-md">

                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Welcome back</h1>
                    <p className="text-gray-600 mb-8 text-center">Log in to your Groovetree account</p>

                    <form>
                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">Email or username</label>
                            <input
                                id="email"
                                type="text"
                                placeholder="Email or username"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#6f42c1] to-[#8a2be2] text-white font-semibold py-3 rounded-md hover:opacity-90 transition cursor-pointer"
                        >
                            Continue
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm font-semibold text-gray-500">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-3 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer">
                            <FaGoogle />
                            Continue with Google
                        </button>
                        <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-3 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer">
                            <FaGithub />
                            Continue with Github
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <Link href="/forgot-password" className="text-purple-600 hover:underline font-semibold">
                            Forgot password?
                        </Link>
                    </div>

                </div>

                <div className="w-full max-w-md mt-10 text-center">
                    <p className="text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-purple-600 hover:underline font-semibold">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right */}
            <div className="hidden md:block w-1/2 bg-gray-100 relative">
                <Image
                    src="/login-page-bg.jpg"
                    alt="Groovetree artists"
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    );
}