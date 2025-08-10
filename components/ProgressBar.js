'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({
  currentTime = 0,
  duration = 0,
  onSeek,
  className = '',
  showTime = true,
  size = 'default',
  variant = 'default',
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const progressRef = useRef(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayProgress = isDragging ? dragValue : progress;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e) => {
    if (disabled || !onSeek) return;
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e) => {
    if (!progressRef.current || disabled) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    
    if (isDragging) {
      setDragValue(percentage);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging || disabled || !onSeek) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    const newTime = (percentage / 100) * duration;
    
    onSeek(newTime);
    setIsDragging(false);
    setDragValue(0);
  };

  const handleTouchStart = (e) => {
    if (disabled || !onSeek) return;
    setIsDragging(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e) => {
    if (!progressRef.current || disabled) return;
    
    const touch = e.touches[0];
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    
    if (isDragging) {
      setDragValue(percentage);
    }
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || disabled || !onSeek) return;
    
    const touch = e.changedTouches[0];
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    const newTime = (percentage / 100) * duration;
    
    onSeek(newTime);
    setIsDragging(false);
    setDragValue(0);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleMouseMove(e);
      }
    };

    const handleGlobalMouseUp = (e) => {
      if (isDragging) {
        handleMouseUp(e);
      }
    };

    const handleGlobalTouchMove = (e) => {
      if (isDragging) {
        handleTouchMove(e);
      }
    };

    const handleGlobalTouchEnd = (e) => {
      if (isDragging) {
        handleTouchEnd(e);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove);
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging]);

  const sizeClasses = {
    sm: 'h-1',
    default: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'bg-gray-200 dark:bg-gray-700',
    primary: 'bg-blue-100 dark:bg-blue-900',
    secondary: 'bg-purple-100 dark:bg-purple-900'
  };

  const progressVariantClasses = {
    default: 'bg-gradient-to-r from-blue-500 to-purple-600',
    primary: 'bg-gradient-to-r from-blue-600 to-blue-400',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {showTime && (
        <div className="flex justify-between items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-mono">
            {formatTime(isDragging ? (dragValue / 100) * duration : currentTime)}
          </span>
          <span className="font-mono">
            {formatTime(duration)}
          </span>
        </div>
      )}
      
      <div
        ref={progressRef}
        className={`
          relative w-full rounded-full cursor-pointer transition-all duration-200
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-y-125'}
        `}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <motion.div
          className={`
            absolute left-0 top-0 h-full rounded-full transition-all duration-150
            ${progressVariantClasses[variant]}
            ${isDragging ? 'shadow-lg' : ''}
          `}
          style={{ width: `${Math.max(0, Math.min(100, displayProgress))}%` }}
          animate={{
            width: `${Math.max(0, Math.min(100, displayProgress))}%`
          }}
          transition={{
            duration: isDragging ? 0 : 0.1,
            ease: 'easeOut'
          }}
        />
        
        {onSeek && !disabled && (
          <motion.div
            className={`
              absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2
              transform -translate-y-1/2 transition-all duration-200
              ${isDragging ? 'scale-125 border-blue-500' : 'border-gray-300 hover:border-blue-400'}
              ${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}
            `}
            style={{
              left: `calc(${Math.max(0, Math.min(100, displayProgress))}% - ${size === 'sm' ? '6px' : size === 'lg' ? '10px' : '8px'})`
            }}
            animate={{
              left: `calc(${Math.max(0, Math.min(100, displayProgress))}% - ${size === 'sm' ? '6px' : size === 'lg' ? '10px' : '8px'})`
            }}
            transition={{
              duration: isDragging ? 0 : 0.1,
              ease: 'easeOut'
            }}
          />
        )}
        
        {isDragging && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded pointer-events-none">
            {formatTime((dragValue / 100) * duration)}
          </div>
        )}
      </div>
      
      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-grabbing" />
      )}
    </div>
  );
};

export default ProgressBar;