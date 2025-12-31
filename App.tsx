import React, { useState, useEffect } from 'react';
import { useCamera } from './hooks/useCamera';
import { FILTERS, FRAMES, FilterOption, FrameOption, AppStep } from './types';
import { Button } from './components/Button';
import { FilterFrameSelector } from './components/FilterFrameSelector';
import { CaptureSession } from './components/CaptureSession';
import { ResultDisplay } from './components/ResultDisplay';
import { Camera, ChevronRight, Zap, Timer, Heart, X } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<AppStep>('intro');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(FILTERS[0]);
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(FRAMES[0]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [timerDuration, setTimerDuration] = useState<number>(3);
  const [showDonationModal, setShowDonationModal] = useState(false);
  
  const { videoRef, startCamera, stopCamera, error, isLoading } = useCamera();

  // Manage camera state based on step
  useEffect(() => {
    if (step === 'customize' || step === 'capture') {
      startCamera();
    } else {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleStart = () => {
    setStep('customize');
  };

  const handleStartCapture = () => {
    setStep('capture');
  };

  const handleCaptureComplete = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setStep('result');
  };

  const handleRetake = () => {
    setPhotos([]);
    setStep('customize');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center max-w-6xl mx-auto w-full sticky top-0 z-50 bg-stone-50/80 backdrop-blur-sm md:static">
        <div className="flex items-center gap-2 select-none cursor-pointer" onClick={() => setStep('intro')}>
          <Camera className="w-5 h-5 md:w-6 md:h-6 text-stone-900" />
          <h1 className="text-lg md:text-xl font-bold tracking-tight">Pitik</h1>
        </div>
        {step !== 'intro' && (
             <div className="text-[10px] md:text-xs font-medium bg-stone-200 px-2 py-1 md:px-3 rounded-full text-stone-600">
                Step {step === 'customize' ? '1' : step === 'capture' ? '2' : '3'} / 3
             </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 w-full max-w-7xl mx-auto relative">
        
        {/* Step 1: Intro */}
        {step === 'intro' && (
          <div className="text-center max-w-lg mx-auto animate-in slide-in-from-bottom-8 duration-700 fade-in w-full">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold mb-4 md:mb-6 tracking-wide uppercase">
              ✨ New Year 2026 Edition
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight text-stone-900 font-handwritten transform -rotate-2">
              Ready for <br/> 2026? 📸
            </h1>
            <p className="text-base md:text-xl text-stone-600 mb-8 md:mb-10 leading-relaxed px-4">
              Capture your first memories of the future. Create a 2026 photo strip in seconds.
            </p>
            <Button size="lg" onClick={handleStart} className="w-full md:w-auto gap-2 group bg-stone-900 hover:bg-stone-800 shadow-2xl hover:shadow-xl transition-all">
              Start Booth
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            {/* Steps - Stack on mobile, Row on desktop */}
            <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-sm text-stone-500">
               <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto justify-start md:justify-center px-8 md:px-0">
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-900 shrink-0">1</div>
                  <span>Pick Filter</span>
               </div>
               
               <div className="hidden md:block w-12 h-px bg-stone-300 mt-0 md:mt-4"></div>
               
               <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto justify-start md:justify-center px-8 md:px-0">
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-900 shrink-0">2</div>
                  <span>Take Photos</span>
               </div>
               
               <div className="hidden md:block w-12 h-px bg-stone-300 mt-0 md:mt-4"></div>
               
               <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto justify-start md:justify-center px-8 md:px-0">
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-900 shrink-0">3</div>
                  <span>Frame & Print</span>
               </div>
            </div>
          </div>
        )}

        {/* Step 2: Customize (Pick Filter) & Step 3: Capture */}
        {(step === 'customize' || step === 'capture') && (
          <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 md:gap-8 items-stretch md:items-start animate-in zoom-in-95 duration-500">
            
            {/* Camera Viewport */}
            <div className="flex-1 w-full order-1">
                {/* Changed aspect ratio logic: 4/3 universally for consistency on tablet and mobile */}
                <div className="relative w-full aspect-[4/3] bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-stone-200">
                
                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-900 text-white z-10">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <p>Starting Camera...</p>
                    </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-900 text-white z-10 p-8 text-center">
                    <p className="max-w-md">{error}</p>
                    </div>
                )}

                {/* Live Video Feed */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                    style={{ filter: selectedFilter.css }}
                />

                {/* Capture Overlay (Countdown, etc) */}
                {step === 'capture' && (
                    <CaptureSession
                    videoRef={videoRef}
                    selectedFilter={selectedFilter}
                    onComplete={handleCaptureComplete}
                    onCancel={() => setStep('customize')}
                    timerDuration={timerDuration}
                    />
                )}

                {/* "Start Capture" Button Overlay */}
                {step === 'customize' && !isLoading && !error && (
                    <div className="absolute bottom-6 md:bottom-8 left-0 right-0 flex justify-center z-10 px-4 pointer-events-none">
                    <Button 
                        size="lg" 
                        onClick={handleStartCapture} 
                        className="pointer-events-auto shadow-xl ring-4 ring-white/50 animate-pulse hover:animate-none w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-base md:text-lg"
                    >
                        Start 3-Shot Capture
                    </Button>
                    </div>
                )}
                </div>
            </div>

            {/* Filter Selector Sidebar (Only in customize step) */}
            {step === 'customize' && (
              <div className="w-full md:w-80 flex flex-col gap-4 animate-in slide-in-from-right-8 duration-500 delay-100 order-2">
                <div className="bg-white/80 backdrop-blur rounded-2xl p-4 md:p-6 shadow-lg border border-stone-100 flex flex-col gap-6">
                    
                    {/* Timer Selector */}
                    <div>
                        <h3 className="text-base font-bold text-stone-800 mb-3 flex items-center gap-2">
                            <Timer className="w-4 h-4 text-stone-500" />
                            Timer Delay
                        </h3>
                        <div className="grid grid-cols-3 gap-2 bg-stone-100 p-1 rounded-xl">
                            {[3, 5, 10].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTimerDuration(t)}
                                    className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                                        timerDuration === t 
                                        ? 'bg-white text-stone-900 shadow-sm ring-1 ring-black/5' 
                                        : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
                                    }`}
                                >
                                    {t}s
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter Selector */}
                    <div>
                        <h3 className="text-base font-bold text-stone-800 mb-3 flex items-center gap-2">
                            <div className="w-4 h-4 bg-amber-400 rounded-full" />
                            Filter
                        </h3>
                        <FilterFrameSelector
                            currentFilter={selectedFilter}
                            onFilterChange={setSelectedFilter}
                            mode="filter"
                            hideTabs={true}
                        />
                    </div>
                </div>
                <div className="hidden md:block bg-amber-50 p-4 rounded-xl text-xs text-amber-800 leading-relaxed border border-amber-100">
                    <strong>Tip:</strong> Pick a filter and set your timer. You can choose your frame design after taking the photos!
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Result (Frame Selection & Print) */}
        {step === 'result' && (
          <ResultDisplay
            photos={photos}
            selectedFrame={selectedFrame}
            onFrameChange={setSelectedFrame}
            onRetake={handleRetake}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 md:p-6 text-center text-stone-400 text-xs md:text-sm">
        <p>&copy; {new Date().getFullYear()} Pitik. by Joshua Fronda</p>
        <div className="mt-3 flex flex-col items-center gap-2">
          <p className="text-xs text-stone-500">Support this project to keep it running</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-stone-300 text-stone-600 hover:border-stone-400 hover:text-stone-800 bg-white"
            onClick={() => setShowDonationModal(true)}
          >
            <Heart className="w-3 h-3" />
            Donate
          </Button>
        </div>
      </footer>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-stone-900">Support Pitik</h3>
              <button
                onClick={() => setShowDonationModal(false)}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-stone-600">
                Scan the QR code below to donate via GCash
              </p>
              
              {/* GCash QR Code */}
              <div className="bg-stone-100 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center w-full max-w-[224px]">
                  <img 
                    src="/qrcode.png" 
                    alt="GCash QR Code" 
                    className="w-full h-full rounded-lg border-2 border-stone-300 object-cover shadow-md"
                  />
                  <p className="text-xs text-stone-500 mt-3">Scan with GCash app</p>
                </div>
              </div>
              
              <p className="text-xs text-stone-400">
                Thank you for supporting this project! ❤️
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}