import React from "react";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
// import spotifyApi from "../lib/spotify";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SECRET,
});

function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      // If refresh access token attempt fails, direct user to login...
      if (session.error === "RefreshTokenError") {
        signIn();
      }

      // If access token is expired, attempt to refresh it
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyApi;
}

export default useSpotify;
