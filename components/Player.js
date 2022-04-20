import { useSession } from "next-auth/react";
import React, { useState, useEffect, useCallback, useRef } from "react";

import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";

import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [volume, setVolume] = useState(50);
  const audioRef = useRef();

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      //   spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      //
      // setCurrentTrackId(data.body?.item?.id);
      //   });
      //   fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //       Authorization: "Bearer",
      //       // 'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //   })
      //     .then((res) => res.json())
      //     .then((data) => console.log(data))
      //     .catch((err) => console.log(err));
      //   spotifyApi.getMyCurrentPlaybackState().then((data) => {
      //     setIsPlaying(data.body?.is_playing);
      //   });
    }
  };

  const handlePlayPause = () => {
    // spotifyApi.getMyCurrentPlaybackState().then((data) => {
    //   if (data.body.is_playing) {
    //     spotifyApi.pause();
    //     setIsPlaying(false);
    //   } else {
    //     spotifyApi.play();
    //     setIsPlaying(true);
    //   }
    // });
    // setIsPlaying((prevState) => !prevState);

    setIsPlaying((prevPlayVideo) => !prevPlayVideo);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    debounceAdjustVolume(volume);
  }, [volume]);

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      //   spotifyApi.setVolume(volume);
    }, 500),
    []
  );

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* { Center} */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />
        <div onClick={handlePlayPause}>
          {isPlaying ? (
            <PauseIcon className="button w-10 h-10" />
          ) : (
            <PlayIcon className="w-10 h-10" />
          )}
        </div>

        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
        <audio
          style={{ display: "none" }}
          ref={audioRef}
          controls
          src="/crazyfrog.mp3"
        ></audio>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          type="range"
          value={volume}
          className=" w-40 md:w-28"
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}

export default Player;
