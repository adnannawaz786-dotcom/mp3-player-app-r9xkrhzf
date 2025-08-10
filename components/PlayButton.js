import React from 'react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

const PlayButton = ({ 
  isPlaying = false, 
  onToggle, 
  size = 'default',
  variant = 'default',
  disabled = false,
  className = '',
  showIcon = true,
  children,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    default: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const iconSizes = {
    sm: 16,
    default: 20,
    lg: 24,
    xl: 32
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && onToggle) {
      onToggle(!isPlaying);
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    playing: { 
      rotate: 0,
      scale: 1,
      transition: { duration: 0.2 }
    },
    paused: { 
      rotate: 0,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled ? "hover" : "idle"}
      whileTap={!disabled ? "tap" : "idle"}
    >
      <Button
        variant={variant}
        size="icon"
        className={`
          ${sizeClasses[size]} 
          ${className}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${variant === 'default' ? 'bg-primary hover:bg-primary/90' : ''}
          ${variant === 'ghost' ? 'hover:bg-accent' : ''}
          ${variant === 'outline' ? 'border-2' : ''}
          transition-all duration-200 ease-in-out
          focus:ring-2 focus:ring-primary focus:ring-offset-2
          active:transform active:scale-95
        `}
        onClick={handleClick}
        disabled={disabled}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        {...props}
      >
        {showIcon && (
          <motion.div
            variants={iconVariants}
            animate={isPlaying ? "playing" : "paused"}
            className="flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause 
                size={iconSizes[size]} 
                className="fill-current"
              />
            ) : (
              <Play 
                size={iconSizes[size]} 
                className="fill-current ml-0.5"
              />
            )}
          </motion.div>
        )}
        {children}
      </Button>
    </motion.div>
  );
};

export default PlayButton;