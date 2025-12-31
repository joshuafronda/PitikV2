import { FilterOption, FrameOption, PrintLayout } from '../types';

/**
 * Captures a single frame from the video element applying the given filter.
 */
export const captureVideoFrame = (
  video: HTMLVideoElement,
  filter: FilterOption
): string => {
  const canvas = document.createElement('canvas');
  // Match resolution to video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Apply CSS filter to context
  // Note: ctx.filter syntax must match CSS filter string exactly.
  ctx.filter = filter.css;
  
  // Flip horizontally to match the mirrored user view
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL('image/jpeg', 0.95);
};

/**
 * Generates the vertical Polaroid strip.
 * Supports 'single' or 'double' layout.
 */
export const generatePolaroidStrip = (
  photos: string[],
  frame: FrameOption,
  layout: PrintLayout = 'single',
  customText: string = 'Polaroid Moment'
): Promise<string> => {
  return new Promise((resolve) => {
    // We create an offscreen image to load the first photo and determine dimensions
    const img = new Image();
    img.src = photos[0];
    img.onload = () => {
      const singleCanvas = document.createElement('canvas');
      const ctx = singleCanvas.getContext('2d');
      if (!ctx) return;

      // Configuration
      const photoWidth = img.width;
      const photoHeight = img.height;
      
      // Design constants (relative to photo size to maintain resolution)
      const paddingX = photoWidth * 0.15;
      const paddingY = photoWidth * 0.15; // Top padding
      const gap = photoWidth * 0.1;
      const bottomLabelSpace = photoWidth * 0.6; 

      const singleWidth = photoWidth + (paddingX * 2);
      const singleHeight = paddingY + (photoHeight * 3) + (gap * 2) + bottomLabelSpace;

      singleCanvas.width = singleWidth;
      singleCanvas.height = singleHeight;

      // Draw Background
      ctx.fillStyle = frame.bgColor;
      ctx.fillRect(0, 0, singleWidth, singleHeight);

      // Draw Photos
      // Proper async load
      const loadPromises = photos.map(src => {
        return new Promise<HTMLImageElement>((r) => {
          const i = new Image();
          i.onload = () => r(i);
          i.src = src;
        });
      });

      Promise.all(loadPromises).then(loadedImages => {
         loadedImages.forEach((image, index) => {
            const x = paddingX;
            const y = paddingY + index * (photoHeight + gap);
            ctx.drawImage(image, 0, 0, photoWidth, photoHeight, x, y, photoWidth, photoHeight);
            
            // Draw border if defined in frame options
            if (frame.borderColor) {
               ctx.strokeStyle = frame.borderColor;
               ctx.lineWidth = photoWidth * 0.015; // Responsive border width
               ctx.strokeRect(x, y, photoWidth, photoHeight);
            }
         });

         // Draw Text
         // Using Roboto instead of Permanent Marker
         ctx.font = `700 ${Math.floor(singleWidth * 0.08)}px "Roboto", sans-serif`;
         ctx.fillStyle = frame.textColor;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         
         const date = new Date().toLocaleDateString(undefined, {
             year: 'numeric',
             month: 'short',
             day: 'numeric'
         });
         
         // Footer Text Logic
         const textY = singleHeight - (bottomLabelSpace / 2);

         ctx.fillText(customText, singleWidth / 2, textY - (singleWidth * 0.05));
         
         // Using Roboto instead of Inter
         ctx.font = `${Math.floor(singleWidth * 0.04)}px "Roboto", sans-serif`;
         ctx.fillStyle = frame.textColor + '99'; // Add some transparency
         ctx.fillText(date, singleWidth / 2, textY + (singleWidth * 0.06));

         // --- LAYOUT LOGIC ---
         if (layout === 'single') {
             resolve(singleCanvas.toDataURL('image/png'));
         } else {
             // Create double canvas
             const doubleCanvas = document.createElement('canvas');
             doubleCanvas.width = singleWidth * 2;
             doubleCanvas.height = singleHeight;
             const dCtx = doubleCanvas.getContext('2d');
             
             if (dCtx) {
                 // Draw Left
                 dCtx.drawImage(singleCanvas, 0, 0);
                 
                 // Draw Right
                 dCtx.drawImage(singleCanvas, singleWidth, 0);
                 
                 resolve(doubleCanvas.toDataURL('image/png'));
             }
         }
      });
    };
  });
};