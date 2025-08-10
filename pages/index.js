import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music, Search, Heart, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { tracks } from '../data/tracks';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [likedTracks, setLikedTracks] = useState(new Set());
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffled,
    isRepeating,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleShuffle,
    toggleRepeat
  } = useAudioPlayer();

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = ['all', ...new Set(tracks.map(track => track.genre))];

  const toggleLike = (trackId) => {
    const newLikedTracks = new Set(likedTracks);
    if (newLikedTracks.has(trackId)) {
      newLikedTracks.delete(trackId);
    } else {
      newLikedTracks.add(trackId);
    }
    setLikedTracks(newLikedTracks);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const AudioVisualizer = () => {
    const [bars, setBars] = useState(Array(20).fill(0));

    useEffect(() => {
      if (isPlaying) {
        const interval = setInterval(() => {
          setBars(Array(20).fill(0).map(() => Math.random() * 100));
        }, 100);
        return () => clearInterval(interval);
      } else {
        setBars(Array(20).fill(0));
      }
    }, [isPlaying]);

    return (
      <div className="flex items-end justify-center space-x-1 h-16">
        {bars.map((height, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-t from-purple-500 to-pink-500 w-1 rounded-full"
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.1 }}
            style={{ minHeight: '4px' }}
          />
        ))}
      </div>
    );
  };

  const MiniPlayer = () => {
    if (!currentTrack) return null;

    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-20 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 z-40"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{currentTrack.title}</p>
              <p className="text-xs text-gray-500 truncate">{currentTrack.artist}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullPlayer(true)}
              className="w-10 h-10 rounded-full"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  const FullPlayer = () => {
    if (!currentTrack) return null;

    return (
      <AnimatePresence>
        {isFullPlayer && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 z-50 flex flex-col"
          >
            <div className="flex-1 flex flex-col justify-center items-center p-8 text-white">
              <Button
                variant="ghost"
                onClick={() => setIsFullPlayer(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                ×
              </Button>
              
              <div className="w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                <Music className="w-24 h-24 text-white" />
              </div>
              
              <AudioVisualizer />
              
              <div className="text-center mt-8 mb-8">
                <h1 className="text-2xl font-bold mb-2">{currentTrack.title}</h1>
                <p className="text-lg text-white/80">{currentTrack.artist}</p>
              </div>
              
              <div className="w-full max-w-sm mb-8">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 cursor-pointer">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-6 mb-8">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={toggleShuffle}
                  className={`text-white hover:bg-white/20 ${isShuffled ? 'text-pink-300' : ''}`}
                >
                  <Shuffle className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={previousTrack}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="w-6 h-6" />
                </Button>
                <Button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-white text-purple-900 hover:bg-white/90"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={nextTrack}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={toggleRepeat}
                  className={`text-white hover:bg-white/20 ${isRepeating ? 'text-pink-300' : ''}`}
                >
                  <Repeat className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-3 w-full max-w-sm">
                <Volume2 className="w-5 h-5 text-white/60" />
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pb-32">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Music Player</h1>
          <p className="text-gray-600">Discover and play your favorite tracks</p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tracks or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Badge
                key={genre}
                variant={selectedGenre === genre ? "default" : "secondary"}
                className={`cursor-pointer capitalize ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm ${
                currentTrack?.id === track.id ? 'ring-2 ring-purple-500 bg-gradient-to-r from-purple-50 to-pink-50' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                          <Music className="w-6 h-6 text-white" />
                        </div>
                        {currentTrack?.id === track.id && isPlaying && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">{track.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {track.genre}
                          </Badge>
                          <span className="text-xs text-gray-500">{track.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(track.id);
                        }}
                        className={`w-8 h-8 ${likedTracks.has(track.id) ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        <Heart className={`w-4 h-4 ${likedTracks.has(track.id) ? 'fill-current' : ''}`} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentTrack?.id === track.id) {
                            togglePlay();
                          } else {
                            playTrack(track);
                          }
                        }}
                        className="w-8 h-8"
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTracks.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <MiniPlayer />
      <FullPlayer />

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 z-30">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-purple-600">
            <Music className="w-5 h-5" />
            <span className="text-xs">Music</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-400">
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-gray-400">
            <Heart className="w-5 h-5" />
            <span className="text-xs">Liked</span>
          </Button>
        </div>
      </div>
    </div>
  );
}