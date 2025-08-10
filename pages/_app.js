import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audioElement = new Audio();
      audioElement.volume = volume;
      
      audioElement.addEventListener('loadstart', () => setIsLoading(true));
      audioElement.addEventListener('canplay', () => setIsLoading(false));
      audioElement.addEventListener('timeupdate', () => {
        setCurrentTime(audioElement.currentTime);
      });
      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(audioElement.duration);
      });
      audioElement.addEventListener('ended', handleTrackEnd);
      
      setAudio(audioElement);
      
      return () => {
        audioElement.removeEventListener('loadstart', () => setIsLoading(true));
        audioElement.removeEventListener('canplay', () => setIsLoading(false));
        audioElement.removeEventListener('timeupdate', () => {
          setCurrentTime(audioElement.currentTime);
        });
        audioElement.removeEventListener('loadedmetadata', () => {
          setDuration(audioElement.duration);
        });
        audioElement.removeEventListener('ended', handleTrackEnd);
        audioElement.pause();
      };
    }
  }, []);

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      playTrack(currentTrack);
    } else if (repeatMode === 'all' || currentIndex < playlist.length - 1) {
      nextTrack();
    } else {
      setIsPlaying(false);
    }
  };

  const playTrack = (track) => {
    if (!audio || !track) return;
    
    setCurrentTrack(track);
    setIsLoading(true);
    audio.src = track.url;
    audio.load();
    
    audio.play().then(() => {
      setIsPlaying(true);
      setIsLoading(false);
    }).catch((error) => {
      console.error('Error playing track:', error);
      setIsLoading(false);
    });
  };

  const togglePlayPause = () => {
    if (!audio || !currentTrack) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Error playing track:', error);
      });
    }
  };

  const nextTrack = () => {
    if (playlist.length === 0) return;
    
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    
    setCurrentIndex(nextIndex);
    playTrack(playlist[nextIndex]);
  };

  const previousTrack = () => {
    if (playlist.length === 0) return;
    
    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    }
    
    setCurrentIndex(prevIndex);
    playTrack(playlist[prevIndex]);
  };

  const seekTo = (time) => {
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const setVolumeLevel = (newVolume) => {
    if (!audio) return;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    audio.volume = clampedVolume;
    setVolume(clampedVolume);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const addToPlaylist = (tracks) => {
    setPlaylist(tracks);
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0]);
      setCurrentIndex(0);
    }
  };

  const playerContextValue = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    isLoading,
    playlist,
    currentIndex,
    isShuffled,
    repeatMode,
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    setVolumeLevel,
    toggleShuffle,
    toggleRepeat,
    addToPlaylist,
    setCurrentTrack,
    setCurrentIndex
  };

  return (
    <AudioPlayerContext.Provider value={playerContextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

const AudioPlayerContext = require('react').createContext();

const Layout = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="pb-24"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function App({ Component, pageProps }) {
  return (
    <AudioPlayerProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AudioPlayerProvider>
  );
}