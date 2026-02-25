import { useEffect, useRef } from "react";

interface VideoProps {
  path: string;
  name: string;
}

const Video: React.FC<VideoProps> = ({ path }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.5;
    }
  }, []);

  return (
    <video
      controls
      width="100%"
      ref={videoRef}
      poster="/english_splash.png"
      style={{
        height: 'stretch'
      }}
    >
      <source src={path} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
