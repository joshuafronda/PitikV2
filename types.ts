export interface FilterOption {
  id: string;
  name: string;
  css: string;
}

export interface FrameOption {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
}

export type AppStep = 'intro' | 'customize' | 'capture' | 'result';

export type PrintLayout = 'single' | 'double';

export const FILTERS: FilterOption[] = [
  { id: 'normal', name: 'Normal', css: 'none' },
  { id: 'warm', name: 'Sun-kissed', css: 'sepia(0.3) saturate(1.2) contrast(1.1)' },
  { id: 'bw', name: 'Noir', css: 'grayscale(1) contrast(1.2) brightness(0.9)' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(0.6) contrast(0.9) brightness(1.1)' },
  { id: 'cool', name: 'Breeze', css: 'hue-rotate(-10deg) saturate(0.9) brightness(1.05)' },
  { id: 'drama', name: 'Drama', css: 'contrast(1.4) saturate(1.1)' },
];

export const FRAMES: FrameOption[] = [
  { id: 'ny2026', name: 'Cloud', bgColor: '#F5F5F0', textColor: '#8B8680', borderColor: '#D4D4CF' },
  { id: 'classic', name: 'Classic', bgColor: '#ffffff', textColor: '#1c1917', borderColor: '#e5e7eb' },
  { id: 'dark', name: 'Midnight', bgColor: '#1c1917', textColor: '#ffffff' },
  { id: 'cream', name: 'Cream', bgColor: '#f5f5f4', textColor: '#44403c' },
  { id: 'pink', name: 'Blush', bgColor: '#fce7f3', textColor: '#831843' },
  { id: 'red', name: 'Ruby', bgColor: '#fee2e2', textColor: '#dc2626' },
];