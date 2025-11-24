import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get("mode") || "signup"; // 'login' or 'signup'

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri:
        process.env.SPOTIFY_REDIRECT_URI ||
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/auth/oauth/spotify/callback`,
    });

    const scopes = ["user-read-email", "user-read-private"];
    const authUrl = spotifyApi.createAuthorizeURL(scopes, mode); // Pass mode as state

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Spotify OAuth initiation error:", error);
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/login?error=oauth_error`
    );
  }
}
