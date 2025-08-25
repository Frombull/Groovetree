import { FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

export default function Footer () {
  return (
    <footer className="bg-[#F0F0F0] text-black pt-16 pb-8 px-8 md:px-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Newsletter */}
          <div className="border border-gray-300 rounded-lg p-6 flex flex-col justify-center">
            <h3 className="font-semibold mb-4 text-lg">Subscribe to our newsletter for the latest updates and releases!</h3>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Your e-mail address"
                className="w-full bg-white border border-gray-400 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button className="bg-white border border-gray-400 rounded-md py-2 px-5 font-semibold hover:bg-gray-100 transition-colors cursor-pointer">
                Join!
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you consent to our <a href="#" className="underline">Privacy Policy</a> and agree to receive updates.
            </p>
          </div>

          {/* About the Creators */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">About the creators</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <FaLinkedin size={24} />
                <a href="#" className="underline hover:text-gray-600 transition-colors">Marco Di Toro</a>
              </li>
              <li className="flex items-center gap-3">
                <FaLinkedin size={24} />
                <a href="#" className="underline hover:text-gray-600 transition-colors">Vitor Torres</a>
              </li>
              <li className="flex items-center gap-3">
                <FaLinkedin size={24} />
                <a href="#" className="underline hover:text-gray-600 transition-colors">Gabriel Costa</a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">Follow Us!</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <FaXTwitter className="h-6 w-6" />
                <a href="#" className="underline hover:text-gray-600 transition-colors">X</a>
              </li>
              <li className="flex items-center gap-3">
                <FaInstagram size={24} />
                <a href="#" className="underline hover:text-gray-600 transition-colors">Instagram</a>
              </li>
              <li className="flex items-center gap-3">
                <FaYoutube size={24} />
                <a href="#" className="underline hover:text-gray-600 transition-colors">Youtube</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-400" />

        {/* Bottom part */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm mt-6 text-gray-700">
          <div className="mb-4 md:mb-0">
            <p>Made with ♥</p>
            <p>© 2025 Groovetree. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="underline hover:text-black">Contact</a>
            <a href="#" className="underline hover:text-black">Privacy Policy</a>
            <a href="#" className="underline hover:text-black">Terms of Service</a>
            <a href="#" className="underline hover:text-black">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
