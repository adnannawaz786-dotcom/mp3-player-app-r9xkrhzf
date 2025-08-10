import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = () => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioData, setAudioData] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audioContext, setAudioContext] = useState(null);

  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
    }

    const audio = audioRef.current;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => handleTrackEnd();
    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
      setIsPlaying(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const initializeAudioContext = useCallback(() => {
    if (!audioContext && audioRef.current) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const analyserNode = ctx.createAnalyser();
        const source = ctx.createMediaElementSource(audioRef.current);

        analyserNode.fftSize = 256;
        source.connect(analyserNode);
        analyserNode.connect(ctx.destination);

        setAudioContext(ctx);
        setAnalyser(analyserNode);

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        setAudioData(dataArray);
      } catch (err) {
        console.warn('Web Audio API not supported:', err);
      }
    }
  }, [audioContext]);

  const getAudioData = useCallback(() => {
    if (analyser && audioData) {
      analyser.getByteFrequencyData(audioData);
      return audioData;
    }
    return null;
  }, [analyser, audioData]);

  const loadTrack = useCallback((track) => {
    if (!track || !track.src) return;

    setError(null);
    setCurrentTrack(track);

    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
    }

    initializeAudioContext();
  }, [volume, isMuted, playbackRate, initializeAudioContext]);

  const play = useCallback(async () => {
    if (!audioRef.current || !currentTrack) return;

    try {
      if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      await audioRef.current.play();
    } catch (err) {
      setError('Failed to play audio');
      console.error('Play error:', err);
    }
  }, [currentTrack, audioContext]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time) => {
    if (audioRef.current && !isNaN(time)) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
    }
  }, [duration]);

  const setVolumeLevel = useCallback((newVolume) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : vol;
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  const setPlaybackSpeed = useCallback((rate) => {
    const speed = Math.max(0.25, Math.min(2, rate));
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      seek(0);
      play();
    } else if (repeatMode === 'all' || currentIndex < playlist.length - 1) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  }, [repeatMode, currentIndex, playlist.length, seek, play, playNext]);

  const playTrack = useCallback((track, index = -1) => {
    loadTrack(track);
    if (index >= 0) {
      setCurrentIndex(index);
    }
    setTimeout(() => play(), 100);
  }, [loadTrack, play]);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }

    playTrack(playlist[nextIndex], nextIndex);
  }, [playlist, currentIndex, isShuffled, playTrack]);

  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return;

    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
    }

    playTrack(playlist[prevIndex], prevIndex);
  }, [playlist, currentIndex, isShuffled, playTrack]);

  // ✅ FIXED: Renamed custom setter to avoid name collision
  const updatePlaylist = useCallback((tracks) => {
    setPlaylist(tracks);
    if (tracks.length > 0 && currentIndex === -1) {
      setCurrentIndex(0);
    }
  }, [currentIndex]);

  const addToPlaylist = useCallback((track) => {
    setPlaylist(prev => [...prev, track]);
  }, []);

  const removeFromPlaylist = useCallback((index) => {
    setPlaylist(prev => prev.filter((_, i) => i !== index));
    if (index === currentIndex) {
      setCurrentIndex(-1);
      setCurrentTrack(null);
      pause();
    } else if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, pause]);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(!isShuffled);
  }, [isShuffled]);

  const toggleRepeat = useCallback(() => {
    const modes = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  }, [repeatMode]);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const getProgress = useCallback(() => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [currentTime, duration]);

  useEffect(() => {
    const cleanup = initializeAudio();
    return cleanup;
  }, [initializeAudio]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    playlist,
    currentIndex,
    isShuffled,
    repeatMode,
    playbackRate,
    play,
    pause,
    togglePlay,
    seek,
    setVolumeLevel,
    toggleMute,
    setPlaybackSpeed,
    playTrack,
    playNext,
    playPrevious,
    updatePlaylist,      // ✅ renamed custom setter
    addToPlaylist,
    removeFromPlaylist,
    toggleShuffle,
    toggleRepeat,
    formatTime,
    getProgress,
    getAudioData,
    loadTrack
  };
};
