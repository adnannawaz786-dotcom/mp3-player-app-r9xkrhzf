// pages/_app.js
import '../styles/globals.css';
import { useState, useEffect, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ Context declared at the very top (fixes TDZ issue)
export const AudioPlayerContext = createContext();

const AudioPlayerProvider = ({ children }) => {
  const [audio] = useState(() => new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  // ✅ Define handlers once so cleanup works
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);

  useEffect(() => {
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio]);

  const playTrack = (src) => {
    if (src !== currentTrack) {
      setCurrentTrack(src);
      audio.src = src;
    }
    audio.play();
  };

  const pauseTrack = () => {
    audio.pause();
  };

  const playerContextValue = {
    audio,
    isPlaying,
    currentTrack,
    playTrack,
    pauseTrack,
  };

  return (
    <AudioPlayerContext.Provider value={playerContextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default function MyApp({ Component, pageProps }) {
  return (
    <AudioPlayerProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={Component.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </AudioPlayerProvider>
  );
}
