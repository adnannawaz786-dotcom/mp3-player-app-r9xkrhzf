import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Search, Filter, Grid, List, Play, Pause, MoreVertical, Heart, Download, Share2, Clock, Calendar, Disc, User, Album, Shuffle, Repeat } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { tracks } from '../data/tracks';

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([
    { id: 1, name: 'My Favorites', count: 12, cover: '/api/placeholder/150/150' },
    { id: 2, name: 'Recently Played', count: 8, cover: '/api/placeholder/150/150' },
    { id: 3, name: 'Chill Vibes', count: 24, cover: '/api/placeholder/150/150' },
    { id: 4, name: 'Workout Mix', count: 18, cover: '/api/placeholder/150/150' }
  ]);

  const { currentTrack, isPlaying, playTrack, pauseTrack, togglePlayPause } = useAudioPlayer();

  const filterOptions = [
    { value: 'all', label: 'All Music', icon: Music },
    { value: 'favorites', label: 'Favorites', icon: Heart },
    { value: 'recent', label: 'Recently Played', icon: Clock },
    { value: 'playlists', label: 'Playlists', icon: Album }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'artist', label: 'Artist' },
    { value: 'album', label: 'Album' },
    { value: 'duration', label: 'Duration' },
    { value: 'dateAdded', label: 'Date Added' }
  ];

  useEffect(() => {
    let filtered = [...tracks];

    if (searchQuery) {
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter === 'favorites') {
      filtered = filtered.filter(track => favorites.includes(track.id));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'album':
          return a.album.localeCompare(b.album);
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });

    setFilteredTracks(filtered);
  }, [searchQuery, selectedFilter, sortBy, favorites]);

  const toggleFavorite = (trackId) => {
    setFavorites(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleTrackPlay = (track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Library
          </h1>
          <p className="text-slate-400">Discover and organize your music collection</p>
        </motion.div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tracks, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-slate-800">
                    {option.label}
                  </option>
                ))}
              </select>

              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>

              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map(filter => {
              const IconComponent = filter.icon;
              return (
                <Button
                  key={filter.value}
                  variant={selectedFilter === filter.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.value)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>

        {selectedFilter === 'playlists' ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {playlists.map(playlist => (
              <motion.div key={playlist.id} variants={itemVariants}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <Album className="w-12 h-12 text-white/80" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" className="rounded-full">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{playlist.name}</h3>
                    <p className="text-sm text-slate-400">{playlist.count} tracks</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTracks.map(track => (
                  <motion.div key={track.id} variants={itemVariants}>
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                          <Disc className="w-12 h-12 text-white/80" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              size="sm"
                              onClick={() => handleTrackPlay(track)}
                              className="rounded-full mr-2"
                            >
                              {currentTrack?.id === track.id && isPlaying ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleFavorite(track.id)}
                              className="rounded-full"
                            >
                              <Heart className={`w-4 h-4 ${favorites.includes(track.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-semibold text-white mb-1 truncate">{track.title}</h3>
                        <p className="text-sm text-slate-400 mb-2 truncate">{track.artist}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{formatDuration(track.duration)}</span>
                          <Badge variant="secondary" className="text-xs">
                            {track.genre}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {filteredTracks.map((track, index) => (
                      <motion.div
                        key={track.id}
                        variants={itemVariants}
                        className="flex items-center gap-4 p-4 hover:bg-white/10 transition-colors cursor-pointer group"
                        onClick={() => handleTrackPlay(track)}
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative">
                          <Disc className="w-6 h-6 text-white/80" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {currentTrack?.id === track.id && isPlaying ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">{track.title}</h3>
                          <p className="text-sm text-slate-400 truncate">{track.artist} • {track.album}</p>
                        </div>

                        <div className="hidden md:block">
                          <Badge variant="secondary" className="text-xs">
                            {track.genre}
                          </Badge>
                        </div>

                        <div className="text-sm text-slate-400 min-w-0">
                          {formatDuration(track.duration)}
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(track.id);
                            }}
                            className="p-2"
                          >
                            <Heart className={`w-4 h-4 ${favorites.includes(track.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>

                          <Button size="sm" variant="ghost" className="p-2">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {filteredTracks.length === 0 && selectedFilter !== 'playlists' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Music className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tracks found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;