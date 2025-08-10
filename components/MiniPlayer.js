import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, MoreHorizontal, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '../lib/utils';

const MiniPlayer = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onExpand,
  progress = 0,
  volume = 0.8,
  onVolumeChange,
  onToggleFavorite,
  className
}) => {
  if (!currentTrack) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed bottom-20 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t',
          className
        )}
      >
        <div className="relative">
          <motion.div
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{ width: `${progress * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
          
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <motion.div
                  className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onExpand}
                >
                  {currentTrack.artwork ? (
                    <img
                      src={currentTrack.artwork}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                  
                  <motion.div
                    className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    whileHover={{ opacity: 1 }}
                  >
                    <ChevronUp className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>

                <div className="flex-1 min-w-0" onClick={onExpand}>
                  <motion.h3
                    className="font-semibold text-sm truncate cursor-pointer hover:text-blue-500 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={currentTrack.id}
                  >
                    {currentTrack.title}
                  </motion.h3>
                  <motion.p
                    className="text-xs text-muted-foreground truncate cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    key={`${currentTrack.id}-artist`}
                  >
                    {currentTrack.artist}
                  </motion.p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleFavorite}
                  className="w-8 h-8 p-0 hover:bg-red-500/10"
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 transition-colors',
                      currentTrack.isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-muted-foreground hover:text-red-500'
                    )}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  className="w-8 h-8 p-0"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onPlayPause}
                    className="w-10 h-10 p-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                  >
                    <AnimatePresence mode="wait">
                      {isPlaying ? (
                        <motion.div
                          key="pause"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Pause className="w-4 h-4 fill-current" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="play"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNext}
                  className="w-8 h-8 p-0"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {currentTrack.duration && (
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{formatTime(progress * currentTrack.duration)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            )}
          </div>
        </div>

        <motion.div
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-muted-foreground/30 rounded-full cursor-pointer"
          whileHover={{ scale: 1.2, backgroundColor: 'rgb(59 130 246)' }}
          onClick={onExpand}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniPlayer;