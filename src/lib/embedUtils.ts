/**
 * Utilitários para converter URLs de plataformas de música em URLs de embed
 */

/**
 * Extrai o ID e tipo de conteúdo do Spotify
 * @example
 * https://open.spotify.com/intl-pt/artist/3TVXtAsR1Inumwj472S9r4
 * → { type: 'artist', id: '3TVXtAsR1Inumwj472S9r4' }
 */
function parseSpotifyUrl(url: string): { type: string; id: string } | null {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("spotify.com")) return null;

    // Regex para capturar: /artist/ID, /album/ID, /track/ID, /playlist/ID
    // Também funciona com: /intl-pt/artist/ID
    const match = urlObj.pathname.match(
      /\/(artist|album|track|playlist)\/([a-zA-Z0-9]+)/
    );

    if (match) {
      return {
        type: match[1], // artist, album, track, ou playlist
        id: match[2], // O ID
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Converte URL de artista/álbum do Spotify em URL de embed
 * @example
 * https://open.spotify.com/intl-pt/artist/3TVXtAsR1Inumwj472S9r4
 * → https://open.spotify.com/embed/artist/3TVXtAsR1Inumwj472S9r4?utm_source=generator&theme=0
 */
function convertSpotifyToEmbed(url: string): string | null {
  const parsed = parseSpotifyUrl(url);
  if (!parsed) return null;

  return `https://open.spotify.com/embed/${parsed.type}/${parsed.id}?utm_source=generator&theme=0`;
}

/**
 * Extrai o ID do vídeo do YouTube
 */
function parseYouTubeUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // YouTube normal: youtube.com/watch?v=ID
    if (urlObj.hostname.includes("youtube.com")) {
      const videoId = urlObj.searchParams.get("v");
      if (videoId) return videoId;
    }

    // YouTube curto: youtu.be/ID
    if (urlObj.hostname === "youtu.be") {
      const videoId = urlObj.pathname.slice(1); // Remove a /
      if (videoId) return videoId;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Converte URL do YouTube em embed
 */
function convertYouTubeToEmbed(url: string): string | null {
  const videoId = parseYouTubeUrl(url);
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Converte URL do SoundCloud em embed
 */
function convertSoundCloudToEmbed(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("soundcloud.com")) return null;

    const embedUrl = new URL("https://w.soundcloud.com/player/");
    embedUrl.searchParams.set("url", url);
    embedUrl.searchParams.set("color", "#ff5500");
    embedUrl.searchParams.set("auto_play", "false");
    embedUrl.searchParams.set("hide_related", "false");
    embedUrl.searchParams.set("show_comments", "true");
    embedUrl.searchParams.set("show_user", "true");
    embedUrl.searchParams.set("show_reposts", "false");
    embedUrl.searchParams.set("show_teaser", "true");
    embedUrl.searchParams.set("visual", "true");

    return embedUrl.toString();
  } catch {
    return null;
  }
}

/**
 * Converte URL do Apple Music em embed
 */
function convertAppleMusicToEmbed(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("music.apple.com")) return null;

    return url.replace("music.apple.com", "embed.music.apple.com");
  } catch {
    return null;
  }
}

/**
 * Função principal que detecta a plataforma e converte para embed
 */
export function convertToEmbed(url: string, type: string): string | null {
  if (!url) return null;

  // Se já for uma URL de embed, retorna ela mesma
  if (url.includes("/embed/") || url.includes("w.soundcloud.com/player")) {
    return url;
  }

  // Converte baseado no tipo
  switch (type) {
    case "SPOTIFY":
      return convertSpotifyToEmbed(url);

    case "SOUNDCLOUD":
      return convertSoundCloudToEmbed(url);

    case "YOUTUBE":
      return convertYouTubeToEmbed(url);

    case "APPLE_MUSIC":
      return convertAppleMusicToEmbed(url);

    default:
      return null;
  }
}

/**
 * Verifica se uma plataforma suporta embeds
 */
export function supportsEmbed(type: string): boolean {
  return ["SPOTIFY", "SOUNDCLOUD", "YOUTUBE", "APPLE_MUSIC"].includes(type);
}
