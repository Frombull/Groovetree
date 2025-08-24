import Link from 'next/link';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex font-sans">

      {/* Seção Esquerda: Imagem de Fundo */}
      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/signup-page-bg.jpg')" }}
      >
        {/* A imagem é aplicada via CSS */}
      </div>

      {/* Seção Direita: Formulário de Inscrição */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-white text-gray-800">
        <div className="w-full max-w-sm">
          
          {/* Logo */}

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Join Groovetree!</h1>
          </div>

          <form>
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#483D8B] text-white font-semibold py-3 rounded-md hover:bg-[#3A316E] transition"
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
                Sign up with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-3 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer">
                <FaGithub />
                Sign up with Github
            </button>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-600 hover:underline font-semibold">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}