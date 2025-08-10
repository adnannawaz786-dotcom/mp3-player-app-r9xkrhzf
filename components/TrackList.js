import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Music, Clock, MoreVertical } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const TrackList = ({ 
  tracks = [], 
  currentTrack = null, 
  isPlaying = false, 
  onTrackSelect, 
  onPlayPause,
  className = '' 
}) => {
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getArtistName = (track) => {
    return track.artist || 'Unknown Artist';
  };

  const getAlbumName = (track) => {
    return track.album || 'Unknown Album';
  };

  const handleTrackClick = (track, index) => {
    if (currentTrack?.id === track.id) {
      onPlayPause();
    } else {
      onTrackSelect(track, index);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!tracks || tracks.length === 0) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Music className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks available</h3>
            <p className="text-gray-500">Add some music files to get started</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-4 border-b bg-gray-50/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Playlist</h2>
          <Badge variant="secondary" className="text-xs">
            {tracks.length} track{tracks.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-h-96 overflow-y-auto"
      >
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isCurrentlyPlaying = isCurrentTrack && isPlaying;
          
          return (
            <motion.div
              key={track.id || index}
              variants={itemVariants}
              className={`group relative border-b border-gray-100 last:border-b-0 transition-colors duration-200 ${
                isCurrentTrack 
                  ? 'bg-blue-50 hover:bg-blue-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center p-4 space-x-4">
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-10 h-10 rounded-full transition-all duration-200 ${
                      isCurrentTrack 
                        ? 'bg-blue-100 hover:bg-blue-200 text-blue-600' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                    onClick={() => handleTrackClick(track, index)}
                  >
                    {isCurrentlyPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </Button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium truncate ${
                        isCurrentTrack ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {track.title || track.name || `Track ${index + 1}`}
                      </h3>
                      <p className={`text-xs truncate mt-0.5 ${
                        isCurrentTrack ? 'text-blue-700' : 'text-gray-500'
                      }`}>
                        {getArtistName(track)}
                      </p>
                      {track.album && (
                        <p className={`text-xs truncate mt-0.5 ${
                          isCurrentTrack ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {getAlbumName(track)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="text-right">
                        <div className={`text-xs flex items-center ${
                          isCurrentTrack ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDuration(track.duration)}
                        </div>
                        {track.size && (
                          <div className={`text-xs mt-0.5 ${
                            isCurrentTrack ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {formatFileSize(track.size)}
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {isCurrentlyPlaying && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 h-0.5 bg-blue-500 origin-left"
                  style={{ width: '100%' }}
                />
              )}

              {isCurrentlyPlaying && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-blue-500 rounded-full"
                        animate={{
                          height: [4, 12, 4],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </Card>
  );
};

export default TrackList;