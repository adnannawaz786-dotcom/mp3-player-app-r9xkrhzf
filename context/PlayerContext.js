'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const PlayerContext = createContext();

const initialState = {
  currentTrack: null,
  currentTrackIndex: -1,
  isPlaying: false,
  isLoading: false,
  duration: 0,
  currentTime: 0,
  volume: 1,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'none',
  playlist: [],
  isFullscreen: false,
  visualizerData: new Array(64).fill(0),
  error: null
};

const playerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        currentTrackIndex: action.payload.index,
        error: null
      };
    
    case 'SET_PLAYING':
      return {
        ...state,
        isPlaying: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload
      };
    
    case 'SET_CURRENT_TIME':
      return {
        ...state,
        currentTime: action.payload
      };
    
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload,
        isMuted: action.payload === 0
      };
    
    case 'TOGGLE_MUTE':
      return {
        ...state,
        isMuted: !state.isMuted
      };
    
    case 'TOGGLE_SHUFFLE':
      return {
        ...state,
        isShuffled: !state.isShuffled
      };
    
    case 'SET_REPEAT_MODE':
      const modes = ['none', 'one', 'all'];
      const currentIndex = modes.indexOf(state.repeatMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return {
        ...state,
        repeatMode: modes[nextIndex]
      };
    
    case 'SET_PLAYLIST':
      return {
        ...state,
        playlist: action.payload
      };
    
    case 'TOGGLE_FULLSCREEN':
      return {
        ...state,
        isFullscreen: !state.isFullscreen
      };
    
    case 'SET_VISUALIZER_DATA':
      return {
        ...state,
        visualizerData: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export const PlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  const initializeAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        
        analyserRef.current.fftSize = 128;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        updateVisualizerData();
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    }
  };

  const updateVisualizerData = () => {
    if (analyserRef.current && dataArrayRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      dispatch({ type: 'SET_VISUALIZER_DATA', payload: Array.from(dataArrayRef.current) });
    }
    
    if (state.isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateVisualizerData);
    }
  };

  const playTrack = async (track, index) => {
    if (!audioRef.current) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_CURRENT_TRACK', payload: { track, index } });
      
      audioRef.current.src = track.url;
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
      
      await audioRef.current.play();
      dispatch({ type: 'SET_PLAYING', payload: true });
      
      initializeAudioContext();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to play track' });
      console.error('Error playing track:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      dispatch({ type: 'SET_PLAYING', payload: false });
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const togglePlayPause = () => {
    if (state.isPlaying) {
      pauseTrack();
    } else if (state.currentTrack) {
      audioRef.current?.play();
      dispatch({ type: 'SET_PLAYING', payload: true });
      updateVisualizerData();
    }
  };

  const nextTrack = () => {
    if (state.playlist.length === 0) return;
    
    let nextIndex;
    
    if (state.isShuffled) {
      nextIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
      nextIndex = (state.currentTrackIndex + 1) % state.playlist.length;
    }
    
    playTrack(state.playlist[nextIndex], nextIndex);
  };

  const previousTrack = () => {
    if (state.playlist.length === 0) return;
    
    let prevIndex;
    
    if (state.isShuffled) {
      prevIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
      prevIndex = state.currentTrackIndex - 1;
      if (prevIndex < 0) {
        prevIndex = state.playlist.length - 1;
      }
    }
    
    playTrack(state.playlist[prevIndex], prevIndex);
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
    }
  };

  const setVolume = (volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    dispatch({ type: 'SET_VOLUME', payload: clampedVolume });
    
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : clampedVolume;
    }
  };

  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_MUTE' });
    
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? state.volume : 0;
    }
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const toggleRepeat = () => {
    dispatch({ type: 'SET_REPEAT_MODE' });
  };

  const setPlaylist = (tracks) => {
    dispatch({ type: 'SET_PLAYLIST', payload: tracks });
  };

  const toggleFullscreen = () => {
    dispatch({ type: 'TOGGLE_FULLSCREEN' });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    };

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };

    const handleEnded = () => {
      dispatch({ type: 'SET_PLAYING', payload: false });
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
        dispatch({ type: 'SET_PLAYING', payload: true });
        updateVisualizerData();
      } else if (state.repeatMode === 'all' || state.currentTrackIndex < state.playlist.length - 1) {
        nextTrack();
      }
    };

    const handleError = () => {
      dispatch({ type: 'SET_ERROR', payload: 'Error loading audio file' });
    };

    const handleCanPlay = () => {
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.repeatMode, state.currentTrackIndex, state.playlist.length]);

  const value = {
    ...state,
    audioRef,
    playTrack,
    pauseTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setPlaylist,
    toggleFullscreen,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext;