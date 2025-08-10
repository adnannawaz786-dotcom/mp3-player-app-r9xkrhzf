import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Library, Heart, Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const Layout = ({ children }) => {
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    isFullscreen,
    play,
    pause,
    nextTrack,
    previousTrack,
    setProgress,
    setVolume,
    toggleFullscreen
  } = useAudioPlayer();

  const navigationItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Search', active: false },
    { icon: Library, label: 'Library', active: false },
    { icon: Heart, label: 'Favorites', active: false }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const MiniPlayer = () => {
    if (!currentTrack) return null;

    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-16 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-gray-200/50"
      >
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {currentTrack.title.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={previousTrack}
                className="h-8 w-8 p-0"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={isPlaying ? pause : play}
                className="h-10 w-10 p-0 bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextTrack}
                className="h-8 w-8 p-0"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{formatTime(progress * currentTrack.duration)}</span>
              <div className="flex-1 relative">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${progress * 100}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={progress}
                  onChange={(e) => setProgress(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const BottomNavigation = () => (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/50"
    >
      <div className="flex items-center justify-around py-2 px-4">
        {navigationItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
              item.active 
                ? 'text-purple-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <item.icon className={`h-5 w-5 ${item.active ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </motion.nav>
  );

  const FullscreenPlayer = () => {
    if (!isFullscreen || !currentTrack) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900"
      >
        <div className="flex flex-col h-full text-white">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/10"
            >
              <Maximize2 className="h-5 w-5 rotate-180" />
            </Button>
            <h1 className="text-lg font-semibold">Now Playing</h1>
            <div className="w-10" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="w-64 h-64 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl mb-8 flex items-center justify-center backdrop-blur-sm">
              <span className="text-6xl font-bold text-white/80">
                {currentTrack.title.charAt(0)}
              </span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{currentTrack.title}</h2>
              <p className="text-lg text-white/70">{currentTrack.artist}</p>
            </div>

            <div className="w-full mb-8">
              <div className="flex items-center space-x-3 text-sm text-white/70 mb-2">
                <span>{formatTime(progress * currentTrack.duration)}</span>
                <div className="flex-1 relative">
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      style={{ width: `${progress * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={progress}
                    onChange={(e) => setProgress(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6 mb-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={previousTrack}
                className="text-white hover:bg-white/10 h-12 w-12 p-0"
              >
                <SkipBack className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                onClick={isPlaying ? pause : play}
                className="text-white hover:bg-white/10 h-16 w-16 p-0 bg-white/20"
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
                onClick={nextTrack}
                className="text-white hover:bg-white/10 h-12 w-12 p-0"
              >
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex items-center space-x-3 w-full max-w-xs">
              <Volume2 className="h-5 w-5 text-white/70" />
              <div className="flex-1 relative">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="pb-32">
        {children}
      </main>
      
      <AnimatePresence>
        <MiniPlayer />
        <FullscreenPlayer />
      </AnimatePresence>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;