import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, MoreHorizontal, ChevronDown, Shuffle, Repeat } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export default function PlayerPage() {
  const router = useRouter();
  const { trackId } = router.query;
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffled,
    repeatMode,
    play,
    pause,
    seekTo,
    setVolume,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
    setCurrentTrack
  } = useAudioPlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [visualizerData, setVisualizerData] = useState([]);

  useEffect(() => {
    if (trackId && trackId !== currentTrack?.id) {
      setCurrentTrack(trackId);
    }
  }, [trackId, currentTrack, setCurrentTrack]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisualizerData(prev => 
        Array.from({ length: 64 }, () => Math.random() * 100)
      );
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.7);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  if (!currentTrack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 flex flex-col h-screen">
        <div className="flex items-center justify-between p-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <div className="text-sm opacity-70">Playing from</div>
            <div className="text-sm font-medium">My Playlist</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={currentTrack.artwork}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </motion.div>

          <div className="w-full max-w-md mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1 truncate">{currentTrack.title}</h1>
                <p className="text-lg opacity-70 truncate">{currentTrack.artist}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className="text-white hover:bg-white/10 ml-4"
              >
                <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="w-full max-w-md mb-8">
            <div className="flex items-center justify-between text-sm opacity-70 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              className="w-full h-1 bg-white/20 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-white rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleShuffle}
              className={`text-white hover:bg-white/10 ${isShuffled ? 'text-green-400' : ''}`}
            >
              <Shuffle className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={previousTrack}
              className="text-white hover:bg-white/10"
            >
              <SkipBack className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              onClick={isPlaying ? pause : play}
              className="w-16 h-16 bg-white text-black hover:bg-white/90 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextTrack}
              className="text-white hover:bg-white/10"
            >
              <SkipForward className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRepeat}
              className={`text-white hover:bg-white/10 ${repeatMode !== 'off' ? 'text-green-400' : ''}`}
            >
              <Repeat className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center space-x-4 w-full max-w-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/10"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <div
              className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer"
              onClick={handleVolumeChange}
            >
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="h-32 flex items-end justify-center px-4 pb-4">
          <div className="flex items-end space-x-1 h-16">
            {visualizerData.map((height, index) => (
              <motion.div
                key={index}
                className="w-1 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full"
                style={{ height: isPlaying ? `${height}%` : '10%' }}
                animate={{ height: isPlaying ? `${height}%` : '10%' }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}