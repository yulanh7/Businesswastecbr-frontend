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
  autoPlay?: boolean; // The new prop
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  imageSrc,
  altText,
  loading,
  setVideoLoading,
  onVideoFinish,
  autoPlay = false
}) => {
  const [hasStarted, setHasStarted] = useState(false); // Initially set to false
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (autoPlay) {
      setPlaying(true);
    }
  }, [autoPlay]);

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

  console.log('playing', playing)
  console.log('hasStarted', hasStarted)

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
