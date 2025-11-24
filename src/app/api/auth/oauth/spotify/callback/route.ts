import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const mode = searchParams.get("state") || "signup"; // 'login' or 'signup'

    if (!code) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/login?error=no_code`
      );
    }

    const spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri:
        process.env.SPOTIFY_REDIRECT_URI ||
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/auth/oauth/spotify/callback`,
    });

    // Exchange code for access token
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body.access_token;
    spotifyApi.setAccessToken(accessToken);

    // Get user info from Spotify
    const me = await spotifyApi.getMe();
    const spotifyId = me.body.id;
    const email = me.body.email;
    const name = me.body.display_name || me.body.id || null;

    if (!email) {
      return NextResponse.redirect(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/login?error=no_email`
      );
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { provider: "spotify", providerId: spotifyId }],
      },
    });

    if (mode === "login") {
      // Login mode: user must exist
      if (!user) {
        return NextResponse.redirect(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/login?error=user_not_found`
        );
      }

      // Update user if needed (in case they logged in with email before)
      if (user.provider !== "spotify" || user.providerId !== spotifyId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: "spotify",
            providerId: spotifyId,
            emailVerified: true, // Spotify emails are verified
            name: name || user.name,
          },
        });
      }
    } else {
      // Signup mode: create user if doesn't exist
      if (!user) {
        // Check if email is already taken by a non-OAuth user
        const existingEmailUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingEmailUser) {
          return NextResponse.redirect(
            `${
              process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            }/signup?error=email_exists`
          );
        }

        // Generate a random password for OAuth users (they won't use it)
        const randomPassword = crypto.randomBytes(32).toString("hex");
        const hashedPassword = await bcrypt.hash(randomPassword, 12);

        user = await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            provider: "spotify",
            providerId: spotifyId,
            emailVerified: true, // Spotify emails are verified
          },
        });
      } else {
        // User exists, update if needed
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: "spotify",
            providerId: spotifyId,
            emailVerified: true,
            name: name || user.name,
          },
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Redirect with token in cookie
    const redirectUrl = new URL(
      mode === "login" ? "/dashboard" : "/dashboard",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    );

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Spotify OAuth callback error:", error);
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/login?error=oauth_error`
    );
  }
}
