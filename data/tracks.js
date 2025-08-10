// Sample track data for the MP3 player
export const tracks = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Nocturnal Vibes",
    duration: "3:45",
    durationSeconds: 225,
    src: "/audio/midnight-dreams.mp3",
    cover: "/images/covers/midnight-dreams.jpg",
    genre: "Electronic",
    year: 2023,
    color: "#6366f1"
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Coastal Sounds",
    album: "Nature's Symphony",
    duration: "4:12",
    durationSeconds: 252,
    src: "/audio/ocean-waves.mp3",
    cover: "/images/covers/ocean-waves.jpg",
    genre: "Ambient",
    year: 2023,
    color: "#0ea5e9"
  },
  {
    id: 3,
    title: "Urban Pulse",
    artist: "City Lights",
    album: "Metropolitan",
    duration: "3:28",
    durationSeconds: 208,
    src: "/audio/urban-pulse.mp3",
    cover: "/images/covers/urban-pulse.jpg",
    genre: "Hip Hop",
    year: 2023,
    color: "#f59e0b"
  },
  {
    id: 4,
    title: "Forest Whispers",
    artist: "Nature's Call",
    album: "Wilderness",
    duration: "5:03",
    durationSeconds: 303,
    src: "/audio/forest-whispers.mp3",
    cover: "/images/covers/forest-whispers.jpg",
    genre: "Ambient",
    year: 2022,
    color: "#10b981"
  },
  {
    id: 5,
    title: "Neon Nights",
    artist: "Synthwave Collective",
    album: "Retro Future",
    duration: "4:35",
    durationSeconds: 275,
    src: "/audio/neon-nights.mp3",
    cover: "/images/covers/neon-nights.jpg",
    genre: "Synthwave",
    year: 2023,
    color: "#ec4899"
  },
  {
    id: 6,
    title: "Mountain High",
    artist: "Peak Performers",
    album: "Summit Sessions",
    duration: "3:52",
    durationSeconds: 232,
    src: "/audio/mountain-high.mp3",
    cover: "/images/covers/mountain-high.jpg",
    genre: "Rock",
    year: 2023,
    color: "#8b5cf6"
  },
  {
    id: 7,
    title: "Desert Storm",
    artist: "Sandstorm",
    album: "Mirage",
    duration: "4:18",
    durationSeconds: 258,
    src: "/audio/desert-storm.mp3",
    cover: "/images/covers/desert-storm.jpg",
    genre: "Electronic",
    year: 2022,
    color: "#f97316"
  },
  {
    id: 8,
    title: "Starlight Serenade",
    artist: "Cosmic Orchestra",
    album: "Celestial Sounds",
    duration: "6:15",
    durationSeconds: 375,
    src: "/audio/starlight-serenade.mp3",
    cover: "/images/covers/starlight-serenade.jpg",
    genre: "Classical",
    year: 2023,
    color: "#3b82f6"
  },
  {
    id: 9,
    title: "Jazz Café",
    artist: "Smooth Operators",
    album: "Late Night Sessions",
    duration: "4:42",
    durationSeconds: 282,
    src: "/audio/jazz-cafe.mp3",
    cover: "/images/covers/jazz-cafe.jpg",
    genre: "Jazz",
    year: 2023,
    color: "#dc2626"
  },
  {
    id: 10,
    title: "Digital Dreams",
    artist: "Cyber Punk",
    album: "Future Shock",
    duration: "3:33",
    durationSeconds: 213,
    src: "/audio/digital-dreams.mp3",
    cover: "/images/covers/digital-dreams.jpg",
    genre: "Electronic",
    year: 2023,
    color: "#06b6d4"
  }
];

// Playlist data
export const playlists = [
  {
    id: 1,
    name: "Chill Vibes",
    description: "Perfect for relaxation and focus",
    trackIds: [2, 4, 8],
    cover: "/images/playlists/chill-vibes.jpg",
    color: "#10b981"
  },
  {
    id: 2,
    name: "Electronic Mix",
    description: "High energy electronic beats",
    trackIds: [1, 3, 5, 7, 10],
    cover: "/images/playlists/electronic-mix.jpg",
    color: "#6366f1"
  },
  {
    id: 3,
    name: "Night Drive",
    description: "Perfect soundtrack for late night drives",
    trackIds: [1, 5, 7, 9],
    cover: "/images/playlists/night-drive.jpg",
    color: "#ec4899"
  }
];

// Genre categories
export const genres = [
  { name: "Electronic", color: "#6366f1", count: 4 },
  { name: "Ambient", color: "#10b981", count: 2 },
  { name: "Hip Hop", color: "#f59e0b", count: 1 },
  { name: "Synthwave", color: "#ec4899", count: 1 },
  { name: "Rock", color: "#8b5cf6", count: 1 },
  { name: "Classical", color: "#3b82f6", count: 1 },
  { name: "Jazz", color: "#dc2626", count: 1 }
];

// Player constants
export const PLAYER_STATES = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  LOADING: 'loading'
};

export const REPEAT_MODES = {
  OFF: 'off',
  ALL: 'all',
  ONE: 'one'
};

export const SHUFFLE_MODES = {
  OFF: 'off',
  ON: 'on'
};

// Audio visualization constants
export const VISUALIZER_TYPES = {
  BARS: 'bars',
  WAVE: 'wave',
  CIRCLE: 'circle'
};

// Default player settings
export const DEFAULT_SETTINGS = {
  volume: 0.8,
  repeat: REPEAT_MODES.OFF,
  shuffle: SHUFFLE_MODES.OFF,
  visualizer: VISUALIZER_TYPES.BARS,
  crossfade: false,
  equalizer: {
    enabled: false,
    preset: 'flat',
    bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
};

// Utility functions for track data
export const getTrackById = (id) => {
  return tracks.find(track => track.id === id);
};

export const getTracksByGenre = (genre) => {
  return tracks.filter(track => track.genre === genre);
};

export const getTracksByArtist = (artist) => {
  return tracks.filter(track => track.artist === artist);
};

export const getPlaylistById = (id) => {
  return playlists.find(playlist => playlist.id === id);
};

export const getPlaylistTracks = (playlistId) => {
  const playlist = getPlaylistById(playlistId);
  if (!playlist) return [];
  return playlist.trackIds.map(trackId => getTrackById(trackId)).filter(Boolean);
};

export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getNextTrack = (currentTrackId, trackList, repeat, shuffle) => {
  const currentIndex = trackList.findIndex(track => track.id === currentTrackId);
  
  if (repeat === REPEAT_MODES.ONE) {
    return trackList[currentIndex];
  }
  
  if (shuffle === SHUFFLE_MODES.ON) {
    const availableTracks = trackList.filter(track => track.id !== currentTrackId);
    return availableTracks[Math.floor(Math.random() * availableTracks.length)];
  }
  
  const nextIndex = currentIndex + 1;
  if (nextIndex >= trackList.length) {
    return repeat === REPEAT_MODES.ALL ? trackList[0] : null;
  }
  
  return trackList[nextIndex];
};

export const getPreviousTrack = (currentTrackId, trackList, shuffle) => {
  if (shuffle === SHUFFLE_MODES.ON) {
    const availableTracks = trackList.filter(track => track.id !== currentTrackId);
    return availableTracks[Math.floor(Math.random() * availableTracks.length)];
  }
  
  const currentIndex = trackList.findIndex(track => track.id === currentTrackId);
  const prevIndex = currentIndex - 1;
  
  if (prevIndex < 0) {
    return trackList[trackList.length - 1];
  }
  
  return trackList[prevIndex];
};

// Search functionality
export const searchTracks = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return tracks.filter(track => 
    track.title.toLowerCase().includes(lowercaseQuery) ||
    track.artist.toLowerCase().includes(lowercaseQuery) ||
    track.album.toLowerCase().includes(lowercaseQuery) ||
    track.genre.toLowerCase().includes(lowercaseQuery)
  );
};

// Recently played tracks (mock data)
export const recentlyPlayed = [
  { trackId: 1, playedAt: new Date('2023-12-01T10:30:00') },
  { trackId: 5, playedAt: new Date('2023-12-01T09:15:00') },
  { trackId: 3, playedAt: new Date('2023-11-30T20:45:00') },
  { trackId: 8, playedAt: new Date('2023-11-30T18:20:00') },
  { trackId: 2, playedAt: new Date('2023-11-30T16:10:00') }
];

export const getRecentlyPlayedTracks = () => {
  return recentlyPlayed
    .sort((a, b) => b.playedAt - a.playedAt)
    .map(item => getTrackById(item.trackId))
    .filter(Boolean)
    .slice(0, 10);
};