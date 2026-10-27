'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speechService } from '@/lib/audio/tts';

interface AudioPlayerButtonProps {
  text: string;
  rate?: number; // 0.75, 1.0, 1.25
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function AudioPlayerButton({
  text,
  rate = 1.0,
  size = 'md',
  className = '',
  showLabel = false,
}: AudioPlayerButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      return;
    }

    setHasError(false);
    setIsPlaying(true);

    speechService.speak(text, {
      rate,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => {
        setIsPlaying(false);
        setHasError(true);
      },
    });
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      title={hasError ? 'Audio gagal dimuat (cek dukungan browser)' : 'Putar Audio Mandarin (TTS)'}
      className={`inline-flex items-center gap-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-brand-400 ${
        isPlaying
          ? 'bg-brand-600 text-white animate-pulse'
          : hasError
          ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
          : 'bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800'
      } ${sizeClasses[size]} ${className}`}
      aria-label={`Dengarkan pelafalan ${text}`}
    >
      {isPlaying ? (
        <Volume2 className={`${iconSizes[size]} animate-spin`} />
      ) : hasError ? (
        <VolumeX className={iconSizes[size]} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
      {showLabel && (
        <span className="font-medium text-xs">
          {isPlaying ? 'Memutar...' : rate !== 1.0 ? `${rate}x` : 'Dengarkan'}
        </span>
      )}
    </button>
  );
}
