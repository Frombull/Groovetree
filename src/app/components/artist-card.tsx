import Image from 'next/image';
import { SiSpotify, SiSoundcloud, SiFacebook, SiYoutube } from 'react-icons/si';

const artist = {
  name: 'Soned',
  role: 'DJ & Comedor de casadas',
  avatarUrl: '/Soned.png',
  links: [
    {
      name: 'Spotify',
      url: '#',
      icon: <SiSpotify size={24} />,
    },
    {
      name: 'Soundcloud',
      url: '#',
      icon: <SiSoundcloud size={24} />,
    },
    {
      name: 'Facebook',
      url: '#',
      icon: <SiFacebook size={24} />,
    },
    {
      name: 'Youtube',
      url: '#',
      icon: <SiYoutube size={24} />,
    },
  ],
};

// Center
export default function ArtistPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
      <ArtistCard />
    </main>
  );
}

function ArtistCard() {
  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-[#2A1B5D] to-[#1A0C4E] rounded-3xl shadow-lg p-6 text-white font-sans">
      
      {/* Image */}
      <div className="flex justify-center mb-5">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-500 to-purple-600 rounded-full blur-sm"></div>
          <Image
            src={artist.avatarUrl}
            alt={`${artist.name}`}
            width={128}
            height={128}
            className="relative object-cover rounded-full ring-4 ring-[#1A0C4E]"
          />
        </div>
      </div>

      {/* Name */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-wider">{artist.name}</h1>
        <p className="text-md text-gray-300">{artist.role}</p>
      </div>

      {/* Links */}
      <div className="flex flex-col space-y-4">
        {artist.links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors duration-300"
          >
            {link.icon}
            <span className="font-semibold">{link.name}</span>
          </a>
        ))}
      </div>

    </div>
  );
}