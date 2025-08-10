import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, MoreHorizontal, ChevronDown, Shuffle, Repeat } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const FullPlayer = ({ 
  isOpen, 
  onClose, 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  currentTime = 0,
  duration = 0,
  volume = 1,
  onVolumeChange,
  onSeek,
  isMuted = false,
  onMute,
  isLiked = false,
  onLike,
  isShuffled = false,
  onShuffle,
  repeatMode = 'none',
  onRepeat
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    onSeek && onSeek(newTime);
  };

  const handleProgressDrag = (e) => {
    if (!isDragging || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const dragX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, dragX / rect.width));
    const newTime = percentage * duration;
    setDragTime(newTime);
  };

  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressDrag(e);
  };

  const handleProgressMouseUp = () => {
    if (isDragging) {
      onSeek && onSeek(dragTime);
      setIsDragging(false);
    }
  };

  const handleVolumeClick = (e) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    onVolumeChange && onVolumeChange(percentage);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleProgressDrag(e);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        handleProgressMouseUp();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragTime]);

  const displayTime = isDragging ? dragTime : currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;

  const generateVisualizerBars = () => {
    return Array.from({ length: 64 }, (_, i) => {
      const height = isPlaying 
        ? Math.random() * 40 + 10 
        : 5;
      const delay = i * 0.02;
      
      return (
        <motion.div
          key={i}
          className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
          style={{ width: '2px' }}
          animate={{
            height: isPlaying ? [height, height * 0.3, height * 1.2, height * 0.8, height] : 5,
          }}
          transition={{
            duration: 0.8,
            repeat: isPlaying ? Infinity : 0,
            delay: delay,
            ease: "easeInOut"
          }}
        />
      );
    });
  };

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        >
          <div className="h-full flex flex-col text-white">
            <div className="flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
              <div className="text-center">
                <p className="text-sm opacity-70">Playing from</p>
                <p className="text-sm font-medium">My Playlist</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-8">
              <motion.div
                className="relative mb-8"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 20, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              >
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 p-2 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                    {currentTrack.artwork ? (
                      <img 
                        src={currentTrack.artwork} 
                        alt={currentTrack.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                        <div className="text-6xl font-bold text-white/20">
                          {currentTrack.title.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              <div className="w-full max-w-sm text-center mb-8">
                <h1 className="text-2xl font-bold mb-2 truncate">{currentTrack.title}</h1>
                <p className="text-lg opacity-70 truncate">{currentTrack.artist}</p>
              </div>

              <div className="w-full max-w-md mb-8">
                <div className="flex items-center justify-center h-16 mb-4">
                  <div className="flex items-end space-x-1">
                    {generateVisualizerBars()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div 
                    ref={progressRef}
                    className="relative h-2 bg-white/20 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                    onMouseDown={handleProgressMouseDown}
                  >
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-150"
                      style={{ left: `calc(${progress}% - 8px)` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm opacity-70">
                    <span>{formatTime(displayTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-8 mb-8">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onShuffle}
                  className={`text-white hover:bg-white/10 ${isShuffled ? 'text-purple-400' : ''}`}
                >
                  <Shuffle className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onPrevious}
                  className="text-white hover:bg-white/10"
                >
                  <SkipBack className="h-8 w-8" />
                </Button>

                <Button
                  size="lg"
                  onClick={onPlayPause}
                  className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-100 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onNext}
                  className="text-white hover:bg-white/10"
                >
                  <SkipForward className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={onRepeat}
                  className={`text-white hover:bg-white/10 ${repeatMode !== 'none' ? 'text-purple-400' : ''}`}
                >
                  <Repeat className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex items-center justify-between w-full max-w-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLike}
                  className={`text-white hover:bg-white/10 ${isLiked ? 'text-red-400' : ''}`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                </Button>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMute}
                    className="text-white hover:bg-white/10"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <div 
                    ref={volumeRef}
                    className="w-24 h-1 bg-white/20 rounded-full cursor-pointer"
                    onClick={handleVolumeClick}
                  >
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-150"
                      style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullPlayer;