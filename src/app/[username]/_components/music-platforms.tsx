import clsx from "clsx";

const musicEmbeds = [
  {
    name: "music.spotify",
    embedUrl:
      "https://open.spotify.com/embed/artist/0TnOYISbd1XYRBk9myaseg?utm_source=generator&theme=0",
    color: "border-[#1DB954]/20",
  },
  {
    name: "music.apple",
    embedUrl: "https://embed.music.apple.com/us/artist/daft-punk/5468295",
    color: "border-[#FA243C]/20",
  },
  {
    name: "music.soundcloud",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2169968298&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    color: "border-[#FF5500]/20",
  },
];

export default function MusicPlatforms() {
  return (
    <div className="text-center">
      <h1 className="my-6 font-sans text-3xl font-bold tracking-tight text-white text-balance">
        Ouça agora
      </h1>
      <div className="flex flex-col gap-8">
        {musicEmbeds.map((platform) => {
          return (
            <div
              key={platform.name}
              className={`w-full overflow-hidden rounded-lg ${
                platform.name === "music.spotify"
                  ? "aspect-[16/4]"
                  : "aspect-[16/9] md:aspect-[21/9]"
              }`}
            >
              <iframe
                src={platform.embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="h-full w-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
