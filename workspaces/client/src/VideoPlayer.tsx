import React, { useEffect, useRef, useState } from 'react';

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [VideoJS, setVideoJS] = useState(null);

  useEffect(() => {
    // コンポーネントがマウントされたときにだけ video.js を読み込む
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

  return <video ref={videoRef} className="video-js" />;
}

