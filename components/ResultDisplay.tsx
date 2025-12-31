import React, { useEffect, useState } from 'react';
import { FrameOption, PrintLayout } from '../types';
import { generatePolaroidStrip } from '../utils/imageProcessing';
import { Button } from './Button';
import { FilterFrameSelector } from './FilterFrameSelector';
import { Download, Printer, ArrowLeft, RectangleVertical, PenLine } from 'lucide-react';

interface ResultDisplayProps {
  photos: string[];
  selectedFrame: FrameOption;
  onFrameChange: (frame: FrameOption) => void;
  onRetake: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  photos,
  selectedFrame,
  onFrameChange,
  onRetake,
}) => {
  const [finalImageSrc, setFinalImageSrc] = useState<string | null>(null);
  const [layout, setLayout] = useState<PrintLayout>('single');
  const [customText, setCustomText] = useState('Pitik');

  // Auto-set text for special frames if the user hasn't typed a custom one yet
  useEffect(() => {
    if (selectedFrame.id === 'ny2026' && customText === 'Pitik') {
        setCustomText('Cloud Dancer 2026');
    } else if (selectedFrame.id !== 'ny2026' && customText === 'Cloud Dancer 2026') {
        setCustomText('Pitik');
    }
  }, [selectedFrame.id, customText]);

  useEffect(() => {
    generatePolaroidStrip(photos, selectedFrame, layout, customText).then(setFinalImageSrc);
  }, [photos, selectedFrame, layout, customText]);

  const handleDownload = () => {
    if (finalImageSrc) {
      const link = document.createElement('a');
      link.download = `pitik-2026-${layout}-${Date.now()}.png`;
      link.href = finalImageSrc;
      link.click();
    }
  };

  const handlePrint = () => {
    if (finalImageSrc) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>Print Your Pitik</title>
                        <style>
                            @page {
                                size: 4in 6in;
                                margin: 0.25in;
                            }
                            body {
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                                background-color: white;
                            }
                            .print-container {
                                width: 3.5in;
                                height: 5.5in;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                            img {
                                max-width: 100%;
                                max-height: 100%;
                                width: auto;
                                height: auto;
                                object-fit: contain;
                            }
                            @media print {
                                body { 
                                    background-color: white; 
                                    margin: 0; 
                                    padding: 0;
                                }
                                .print-container {
                                    width: 3.5in;
                                    height: 5.5in;
                                }
                                img { 
                                    max-width: 100%; 
                                    max-height: 100%;
                                    width: auto;
                                    height: auto;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="print-container">
                            <img src="${finalImageSrc}" onload="setTimeout(() => { window.print(); window.close(); }, 500);" />
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-700 flex flex-col md:flex-row gap-4 md:gap-6 items-start justify-center p-2 md:p-3">
      
      {/* Left Column: Preview */}
      <div className="w-full md:flex-1 flex flex-col items-center">
        <div className={`relative group w-full shadow-lg transition-all duration-500 ${layout === 'double' ? 'max-w-[1000px]' : 'max-w-[300px] md:max-w-xs'}`}>
          {!finalImageSrc ? (
            <div className="w-full aspect-[1/3] bg-stone-200 animate-pulse flex items-center justify-center rounded-lg">
              <span className="text-stone-400 font-medium">Developing...</span>
            </div>
          ) : (
            <img
              src={finalImageSrc}
              alt="Polaroid Strip"
              className="w-full h-auto rounded-sm"
            />
          )}
        </div>
      </div>

      {/* Right Column: Controls */}
      <div className="w-full md:w-80 flex flex-col gap-2 md:gap-1 space-y-1 bg-white/50 backdrop-blur-sm p-3 md:p-4 rounded-2xl border border-white/50 shadow-sm sticky top-4">
        
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-handwritten text-stone-800 mb-1">Almost Done!</h2>
          <p className="text-stone-600 text-xs">Design your strip and choose your print format.</p>
        </div>

        {/* Frame Selector Section */}
        <div>
          <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1 md:mb-2">Select Frame</h3>
          <FilterFrameSelector 
             mode="frame" 
             hideTabs={true}
             currentFrame={selectedFrame}
             onFrameChange={onFrameChange}
          />
        </div>

        {/* Caption Input Section */}
        <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1 md:mb-2">Write Caption</h3>
            <div className="relative group">
                <input 
                    type="text" 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    maxLength={25}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border-2 border-stone-200 focus:border-stone-900 focus:ring-0 outline-none text-stone-800 font-handwritten text-base transition-colors placeholder:text-stone-300"
                    placeholder="Enter your caption..."
                />
                <PenLine className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-stone-900 transition-colors" />
            </div>
        </div>

        {/* Layout Selector Section */}
        <div>
           <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-1 md:mb-2">Banner Layout</h3>
           <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLayout('single')}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-all ${
                    layout === 'single' 
                    ? 'border-stone-900 bg-stone-100 text-stone-900' 
                    : 'border-stone-200 hover:border-stone-300 text-stone-500 hover:bg-white'
                }`}
              >
                 <RectangleVertical className="w-5 h-5" />
                 <span className="text-xs font-semibold">Single Strip</span>
              </button>

              <button
                onClick={() => setLayout('double')}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-all ${
                    layout === 'double' 
                    ? 'border-stone-900 bg-stone-100 text-stone-900' 
                    : 'border-stone-200 hover:border-stone-300 text-stone-500 hover:bg-white'
                }`}
              >
                 <div className="flex gap-0.5 opacity-80">
                    <RectangleVertical className="w-4 h-4" />
                    <RectangleVertical className="w-4 h-4" />
                 </div>
                 <span className="text-xs font-semibold">2 Strips</span>
              </button>
           </div>
        </div>

        <div className="h-px bg-stone-200 w-full my-0"></div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button onClick={handlePrint} size="md" className="w-full gap-2 shadow-lg bg-amber-500 hover:bg-amber-600 text-white border-none py-2 md:py-3">
            <Printer className="w-4 h-4" />
            Print Now
          </Button>
          
          <Button onClick={handleDownload} variant="outline" className="w-full gap-2 bg-white py-2 md:py-3">
            <Download className="w-4 h-4" />
            Save to Device
          </Button>

          <Button onClick={onRetake} variant="ghost" className="w-full gap-2 text-stone-500 hover:text-stone-800 mt-1">
            <ArrowLeft className="w-3 h-3" />
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};