import React, { useEffect, useState, useRef } from 'react';
import { FilterOption } from '../types';
import { captureVideoFrame } from '../utils/imageProcessing';

interface CaptureSessionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  selectedFilter: FilterOption;
  onComplete: (photos: string[]) => void;
  onCancel: () => void;
  timerDuration: number;
}

export const CaptureSession: React.FC<CaptureSessionProps> = ({
  videoRef,
  selectedFilter,
  onComplete,
  onCancel,
  timerDuration,
}) => {
  const [count, setCount] = useState<number | null>(null);
  const [photosTaken, setPhotosTaken] = useState<string[]>([]);
  const [isFlashing, setIsFlashing] = useState(false);
  const [sessionPhase, setSessionPhase] = useState<'get-ready' | 'counting' | 'done'>('get-ready');

  const MAX_PHOTOS = 3;
  // Use the passed timer duration instead of a hardcoded constant
  const COUNTDOWN_START = timerDuration;

  const takePhoto = () => {
    if (videoRef.current) {
      // Trigger flash effect
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 150);

      const photo = captureVideoFrame(videoRef.current, selectedFilter);
      setPhotosTaken((prev) => {
        const newPhotos = [...prev, photo];
        if (newPhotos.length === MAX_PHOTOS) {
            setSessionPhase('done');
            setTimeout(() => onComplete(newPhotos), 1000); // Small delay before finishing
        } else {
            // Start next countdown after a brief pause
            setTimeout(() => startCountdown(), 1500);
        }
        return newPhotos;
      });
    }
  };

  const startCountdown = () => {
    setSessionPhase('counting');
    setCount(COUNTDOWN_START);
  };

  // Countdown Logic
  useEffect(() => {
    if (sessionPhase === 'counting' && count !== null) {
      if (count > 0) {
        const timer = setTimeout(() => setCount(count - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Count reached 0, take photo
        takePhoto();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, sessionPhase]);

  // Initial start
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (sessionPhase === 'get-ready') {
       timeout = setTimeout(() => {
          startCountdown();
       }, 2000);
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none p-4">
        
      {/* Flash Overlay */}
      <div 
        className={`absolute inset-0 bg-white transition-opacity duration-100 ${isFlashing ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* Countdown / Status */}
      {sessionPhase === 'get-ready' && (
        <div className="animate-bounce bg-white/90 backdrop-blur text-stone-900 px-6 py-3 md:px-8 md:py-4 rounded-2xl shadow-2xl mx-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-handwritten">Get Ready!</h2>
        </div>
      )}

      {sessionPhase === 'counting' && count !== null && count > 0 && (
        <div className="text-8xl md:text-[120px] font-bold text-white drop-shadow-lg font-handwritten animate-pulse">
          {count}
        </div>
      )}

      {sessionPhase === 'counting' && count === 0 && (
        <div className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg font-handwritten">
          SMILE!
        </div>
      )}

      {/* Progress Dots */}
      <div className="absolute bottom-6 md:bottom-10 flex space-x-3 md:space-x-4">
        {[...Array(MAX_PHOTOS)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white transition-colors ${
              i < photosTaken.length ? 'bg-white' : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};