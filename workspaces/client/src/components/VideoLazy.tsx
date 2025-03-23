// src/components/VideoLazy.tsx
import React, { useRef, useEffect, useState } from 'react';

export default function VideoLazy({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [VideoJS, setVideoJS] = useState<any>(null);

  useEffect(() => {
    import('video.js').then((mod) => {
      setVideoJS(mod.default);
    });
  }, []);

  useEffect(() => {
    if (VideoJS && videoRef.current) {
      const player = VideoJS(videoRef.current);
      player.src(src);
    }
  }, [VideoJS, src]);

  return (
    <video ref={videoRef} className="video-js" controls style={{ width: '100%' }} />
  );
}
