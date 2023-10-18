import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Image } from "react-bootstrap";
import { FaPlay } from 'react-icons/fa';
import pageStyles from "../styles/page.module.scss"; // Adjust the path if needed

interface VideoPlayerProps {
  videoUrl: string;
  imageSrc: string;
  altText: string;
  loading?: boolean;
  setVideoLoading?: (loading: boolean) => void;
  onVideoFinish?: () => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  hasStarted: boolean;
  setHasStarted: (hasStarted: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  imageSrc,
  altText,
  loading,
  setVideoLoading,
  onVideoFinish,
  playing,
  setPlaying,
  hasStarted,
  setHasStarted,
}) => {

  const handlePlay = () => {
    setHasStarted(true);
    setPlaying(false);
    setTimeout(() => {
      setPlaying(true);
    }, 50);

  };

  const handleVideoPlay = () => {
    setHasStarted(true);
    setPlaying(true);
  };

  const handleVideoPause = () => {
    setPlaying(false);
  };



  return (
    <div className={pageStyles.videoContainer}>
      {!hasStarted && (
        <div className={pageStyles.videoCover} onClick={handlePlay}>
          <Image src={imageSrc} alt={altText} />
          <div className={pageStyles.videoButtonBox}>
            <FaPlay className={pageStyles.videoButton} size={40} />
          </div>
        </div>
      )}
      <ReactPlayer
        url={videoUrl}
        onEnded={onVideoFinish}
        controls={true}
        playing={playing}
        width="100%"
        height="100%"
        config={{ file: { attributes: { preload: 'auto' } } }}
        onReady={() => {
          if (setVideoLoading) {
            setVideoLoading(false);
          }
        }}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
      />
    </div>
  );
}


export default VideoPlayer;
